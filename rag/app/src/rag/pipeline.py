import os
from typing import List, TypedDict

from langchain_community.chat_models import ChatOllama
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langgraph.graph import StateGraph, END

from .embedding import load_embedding
from .vector_store import load_vector_store
from .mongodb import MongoDBConnector
from .retriever import load_retriver
from .prompt import load_prompts


class PipelineState(TypedDict):
    question: str
    tags: str
    documents: List[str]
    generation: str
    query_rewrited: bool


class Pipeline:
    def __init__(self):
        print("Pipeline creation ...")
        self.prompts = load_prompts()

        OLLAMA_URL = os.environ.get("OLLAMA_URL")
        OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL")
        OLLAMA_EMBEDDING = os.environ.get("OLLAMA_EMBEDDING")
        CHUNK_SIZE = int(os.environ.get("TEXT_SPLITTER_CHUNK_SIZE"))
        OVERLAP_SIZE = int(os.environ.get("TEXT_SPLITTER_OVERLAP_SIZE"))

        self.llm = ChatOllama(model=OLLAMA_MODEL, temperature=0, base_url=OLLAMA_URL)
        self.llm_json = ChatOllama(model=OLLAMA_MODEL, format="json", temperature=0, base_url=OLLAMA_URL)
        self.embedding = load_embedding(OLLAMA_URL, OLLAMA_EMBEDDING)


        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=OVERLAP_SIZE)

        self.mongodb = MongoDBConnector()

        self.vector_store = load_vector_store(mongodb=self.mongodb, embedding=self.embedding,
                                              embedding_size=len(self.embedding.embed_query("")))

        self.retriever = load_retriver(vector_store=self.vector_store, mongo_db=self.mongodb)

        self.rag_chain = self.prompts['generate'] | self.llm | StrOutputParser()
        self.retrieval_grader = self.prompts['retrieval_grader'] | self.llm_json | JsonOutputParser()
        self.hallucination_grader = self.prompts['hallucination_grader'] | self.llm_json | JsonOutputParser()
        self.answer_grader = self.prompts['answer_grader'] | self.llm_json | JsonOutputParser()
        self.question_rewriter = self.prompts['re_writer'] | self.llm | StrOutputParser()


        def generate(state):
            print("---GENERATE---")
            question = state["question"]
            documents = state["documents"]
            generation = self.rag_chain.invoke({"context": documents, "question": question})
            print(f"Generation : \n{generation}")
            return {"documents": documents, "question": question, "generation": generation,
                    "query_rewrited": state['query_rewrited']}

        def retrieve(state):
            print("---RETRIEVE---")
            question = state["question"]
            tags = state["tags"]
            documents = self.retriever.invoke(question, tags)
            print(f"List Documents : {list(set(doc.metadata['filename'] for doc in documents))}")
            return {"documents": documents, "question": question, "query_rewrited": state['query_rewrited'] if (
                    'query_rewrited' in state and state['query_rewrited']) else False}

        def grade_documents(state):
            print("---CHECK DOCUMENT RELEVANCE TO QUESTION---")
            question = state["question"]
            documents = state["documents"]
            filtered_docs = []
            for d in documents:
                score = self.retrieval_grader.invoke({"question": question, "document": d.page_content})
                if "score" in score and type(score["score"]) is str and score["score"].lower() == "yes":
                    print(f"{d.metadata['filename']} - Document accepted")
                    filtered_docs.append(d)
                else:
                    print(f"{d.metadata['filename']} - Document rejected")
            return {"documents": filtered_docs, "question": question, "query_rewrited": state['query_rewrited']}

        def transform_query(state):
            print("---TRANSFORM QUERY---")
            question = state["question"]
            documents = state["documents"]
            better_question = self.question_rewriter.invoke({"question": question})
            print(f"New question : {better_question}")
            return {"documents": documents, "question": better_question, "query_rewrited": True}

        def decide_to_generate(state):
            filtered_documents = state["documents"]
            if not filtered_documents:
                if state['query_rewrited']:
                    return "stop"
                return "transform_query"
            return "generate"

        def stop_response(state):
            question = state["question"]
            documents = state["documents"]
            return {"documents": documents, "question": question, "query_rewrited": state['query_rewrited']}

        def grade_generation(state):
            question = state["question"]
            documents = state["documents"]
            generation = state["generation"]

            score = self.hallucination_grader.invoke(
                {"documents": documents, "generation": generation}
            )
            print("hallucination grader :", score)
            if "score" in score and type(score["score"]) is str and score["score"].lower() == "yes":
                score = self.answer_grader.invoke({"question": question, "generation": generation})
                print("answer grader :", score)
                if "score" in score and type(score["score"]) is str and score["score"].lower() == "yes":
                    print("-> useful")
                    return "useful"
            if state['query_rewrited']:
                print("-> stop")
                return "stop"
            print("-> transform_query")
            return "transform_query"

        self.workflow = StateGraph(PipelineState)
        self.workflow.add_node("retrieve", retrieve)
        self.workflow.add_node("grade_documents", grade_documents)
        self.workflow.add_node("generate", generate)
        self.workflow.add_node("transform_query", transform_query)
        self.workflow.add_node("stop", stop_response)

        self.workflow.set_entry_point("retrieve")
        self.workflow.add_edge("retrieve", "grade_documents")
        self.workflow.add_conditional_edges(
            "grade_documents",
            decide_to_generate,
            {
                "transform_query": "transform_query",
                "generate": "generate",
                "stop": "stop"
            },
        )
        self.workflow.add_edge("transform_query", "retrieve")
        self.workflow.add_conditional_edges(
            "generate",
            grade_generation,
            {
                "useful": END,
                "stop": "stop",
                "transform_query": "transform_query"
            },
        )
        self.workflow.add_edge("stop", END)

        self.app = self.workflow.compile()

        self.workflow_search = StateGraph(PipelineState)
        self.workflow_search.add_node("retrieve", retrieve)
        self.workflow_search.add_node("grade_documents", grade_documents)
        self.workflow_search.set_entry_point("retrieve")
        self.workflow_search.add_edge("retrieve", "grade_documents")
        self.workflow_search.add_edge("grade_documents", END)
        self.app_search = self.workflow_search.compile()

    def search(self, query, tags=""):
        inputs = {"question": query, "tags": tags}
        outputs = [o for o in self.app_search.stream(inputs)]
        documents = outputs[-1][list(outputs[-1].keys())[0]]['documents']
        documents = list(set([doc.metadata['id'] for doc in documents]))
        return {"query": query, "ids": documents}

    def chat(self, query):
        return self.llm.invoke(query)

    def rag(self, query, tags=""):
        inputs = {"question": query, "tags": tags}
        outputs = [o for o in self.app.stream(inputs)]
        last_step = list(outputs[-1].keys())[0]
        out = outputs[-1][last_step]
        if last_step == "generate":
            documents = list(set([doc.metadata['id'] for doc in out['documents']]))
            return {"query": query, "answer": out['generation'], "ids": documents}
        return {"query": query, "answer": "Aucune réponse n'a été trouvée", "ids": []}

    def insert(self, document):
        self.vector_store.add_documents([document])
        self.retriever = load_retriver(vector_store=self.vector_store, mongo_db=self.mongodb)

    def update_documents(self, id, new_filename, new_tags):
        # update all documents with the same id
        self.mongodb.collection.update_many({"id": id}, {"$set": {"filename": new_filename, "tags": new_tags}})
        # update retriever
        self.retriever = load_retriver(vector_store=self.vector_store, mongo_db=self.mongodb)

    def delete_documents(self, id):
        # delete all documents with the same id
        self.mongodb.collection.delete_many({"id": id})
        # update retriever
        self.retriever = load_retriver(vector_store=self.vector_store, mongo_db=self.mongodb)



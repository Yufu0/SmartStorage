from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_core.vectorstores import VectorStore

from .mongodb import MongoDBConnector

SPLIT_CHAR = ','


class VectorRetriever:
    def __init__(self, vector_store: VectorStore, mongo_db: MongoDBConnector):
        self.k = 10

        documents = mongo_db.documents()
        retriever = vector_store.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": self.k
            }
        )
        if documents:
            bm25_retriever = BM25Retriever.from_documents(documents, k=self.k)
            ensemble_retriever = EnsembleRetriever(
                retrievers=[bm25_retriever, retriever], weights=[0.5, 0.5]
            )
            self.base_retriever = ensemble_retriever
        else:
            self.base_retriever = retriever

    def invoke(self, query, tags=""):
        retrieved_docs = []
        offset = 0
        batch_size = 2 * self.k

        while len(retrieved_docs) < self.k:
            # Retrieve documents with an offset to avoid duplicates
            results = self.base_retriever.invoke(query, search_kwargs={"k": batch_size, "offset": offset})
            # Filter results based on the tags
            if tags == "":
                filtered_results = results
            else:
                tags = tags.split(',')
                filtered_results = (doc for doc in results if all((t in doc.metadata['tags'].split(',') for t in tags)))

            retrieved_docs.extend(filtered_results)

            # Break if no more results are found
            if len(results) < batch_size:
                break

            # Update the offset to retrieve the next batch of documents
            offset += batch_size

        # Ensure we only return exactly k documents
        return retrieved_docs[:self.k]


def load_retriver(vector_store: VectorStore, mongo_db: MongoDBConnector):
    return VectorRetriever(vector_store, mongo_db)

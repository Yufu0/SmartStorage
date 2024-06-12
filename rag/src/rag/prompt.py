from langchain_core.prompts import PromptTemplate


def llama3_prompts(system_prompt, user_prompt):
    return f"""<|start_header_id|>system<|end_header_id|>

{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>

{user_prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
"""


def phi3_prompts(system_prompt, user_prompt):
    return f"""<|system|>
{system_prompt}<|end|>
<|user|>
{user_prompt}<|end|>
<|assistant|>
"""


prompts = {
    "generate": {
        "system": """You are an assistant for question-answering tasks. 
    Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. 
    Answer in French. Use three sentences maximum and keep the answer concise. """,
        "user": """
Question: {question} 
Context: {context} 
Answer: """,
        "input_variables": ["question", "context"]
    },
    "hallucination_grader": {
        "system": """You are a grader assessing whether 
    an answer is grounded in / supported by a set of facts. Give a binary 'yes' or 'no' score to indicate 
    whether the answer is grounded in / supported by a set of facts. Provide the binary score as a JSON with a 
    single key 'score' and no preamble or explanation. """,
        "user": """
Here are the facts:
\n ------- \n
{documents} 
\n ------- \n
Here is the answer: {generation}
""",
        "input_variables": ["generation", "documents"],
    },
    "answer_grader": {
        "system": """You are a grader assessing whether an 
    answer is useful to resolve a question. Give a binary score 'yes' or 'no' to indicate whether the answer is 
    useful to resolve a question. Provide the binary score as a JSON with a single key 'score' and no preamble or explanation. """,
        "user": """
\n ------- \n
{generation} 
\n ------- \n
Here is the question: {question}
""",
        "input_variables": ["generation", "question"]
    },
    "retrieval_grader": {
        "system": """You are a grader assessing relevance 
    of a retrieved document to a user question. If the document contains keywords related to the user question, 
    grade it as relevant. It does not need to be a stringent test. The goal is to filter out erroneous retrievals. \n
    Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question. \n
    Provide the binary score as a JSON with a single key 'score' and no premable or explanation.
""",
        "user": """
Here is the retrieved document: \n\n {document} \n\n
Here is the user question: {question} \n
""",
        "input_variables": ["question", "document"]
    },
    "re_writer": {
        "system": """You are a question re-writer that 
    converts an input question to a better version that is optimized for vectorstore retrieval.
    Look at the initial and formulate an improved question with no preamble. The improved question should be in French. """,
        "user": """
    Here is the initial question: \n\n {question}. \n\n
    Improved question with no preamble: 
    """,
        "input_variables": ['question']
    }
}


def load_prompts():
    return {
        key: PromptTemplate(
            template=llama3_prompts(value["system"], value["user"]),
            input_variables=value["input_variables"]
        ) for key, value in prompts.items()
    }

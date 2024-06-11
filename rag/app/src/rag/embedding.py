from langchain_community.embeddings import OllamaEmbeddings


def load_embedding(ollama_url: str, ollama_embedding: str):
    return OllamaEmbeddings(model=ollama_embedding, base_url=ollama_url)

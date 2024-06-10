from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo.operations import SearchIndexModel
from .mongodb import MongoDBConnector


def load_vector_store(mongodb: MongoDBConnector, embedding: Embeddings, embedding_size: int):
    if mongodb.db_name not in mongodb.client.list_database_names():
        mongodb.collection = mongodb.client[mongodb.db_name][mongodb.collection_name]

        vector_search = MongoDBAtlasVectorSearch.from_documents(
            documents=[Document(metadata={}, page_content="")],
            embedding=embedding,
            collection=mongodb.collection,
            index_name=mongodb.vector_search_name,
        )

        vector_search.delete()

        mongodb.collection.create_search_index(
            model=SearchIndexModel(
                definition={
                    "mappings": {
                        "dynamic": True,
                        "fields": {
                            "embedding": {
                                "dimensions": embedding_size,
                                "similarity": "cosine",
                                "type": "knnVector"
                            }
                        }
                    }
                },
                name=mongodb.vector_search_name
            )
        )
    mongodb.collection = mongodb.client[mongodb.db_name][mongodb.collection_name]
    vector_search = MongoDBAtlasVectorSearch(
        embedding=embedding,
        collection=mongodb.collection,
        index_name=mongodb.vector_search_name,
    )

    return vector_search


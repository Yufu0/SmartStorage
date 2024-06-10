import os

from langchain_core.documents import Document
from pymongo import MongoClient


class MongoDBConnector():
    def __init__(self):
        self.mongodb_uri = os.getenv('MONGODB_URI')
        self.db_name = os.getenv('MONGODB_DB')
        self.collection_name = os.getenv('MONGODB_COLLECTION')
        self.vector_search_name = "index"

        self.client = MongoClient(self.mongodb_uri)
        self.collection = self.client[self.db_name][self.collection_name]

    def documents(self):
        docs = [Document(
            page_content=e['text'],
            metadata = {
                "id": e['id'],
                "tags": e['tags'],
                "filename": e['filename']
            }
        ) for e in self.client[self.db_name][self.collection_name].find()]
        return docs

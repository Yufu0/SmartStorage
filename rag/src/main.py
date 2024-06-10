import os.path
import time

from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document

from rag import Pipeline, DocumentLoader
import json

config = json.load(open('../../config.json'))
def main():
    pipeline = Pipeline()

    # pdfs = ['../../test_data/ING1_GI_-_S1_-_OLLIVIER_R.pdf',
    #         '../../test_data/Avis_d_impot_2022_sur_les_revenus_2021.pdf',
    #         '../../test_data/justificatif_idelis.PDF',
    #         '../../test_data/RENSEIGNEMENTS_ADMINISTRATIFS.pdf',
    #         '../../test_data/S1 - UE1 - Algorithmique_quantique.pdf',]
    #
    # documents = [DocumentLoader().load(pdf, 'pdf') for pdf in pdfs]
    # print(len(documents))
    # for document, pdf in zip(documents, pdfs):
    #     path = os.path.basename(pdf)
    #     print(path)
    #     for split in document:
    #         split.metadata = {
    #             "id": "test",
    #             "tags": "test",
    #             "filename": path
    #         }
    #         pipeline.insert(split)

    query = "Fait un resumé de mon bulletin scolaire."
    print("Query : ", query)
    print("--------------------")

    start = time.perf_counter()
    res = pipeline.rag(query)
    print("Answer : \n", res)
    print("--------------------")
    print("Time (s) : ", time.perf_counter() - start)


if __name__ == "__main__":
    main()
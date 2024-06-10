import io
from typing import Annotated
from PIL import Image
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

import uvicorn
import os

from rag import Pipeline, DocumentLoader

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = Pipeline()


@app.get("/search")
def search(query: str, tags: str = ""):
    print(query)
    answer = pipeline.search(query, tags)
    print(answer)
    return answer


@app.get("/chat")
def chat(query: str):
    answer = pipeline.chat(query)
    return answer


@app.get("/rag")
def rag(query: str, tags: str = ""):
    answer = pipeline.rag(query, tags)
    print(answer)
    return answer


@app.post("/insert")
def insert(file: UploadFile = File(...), tags: Annotated[str, Form()] = "", id: Annotated[str, Form()] = ""):
    print("Name :", file.filename)
    print("Content-Type :", file.content_type)
    print("Size :", file.size)
    print("Tags :", tags)
    print("ID :", id)

    contents = file.file.read()

    path = os.path.join("tmp", file.filename)

    document_loader = DocumentLoader()
    documents = []
    if not os.path.exists("tmp"):
        os.makedirs("tmp")

    try:
        if os.path.splitext(file.filename)[1] == ".pdf":
            with open(path, 'wb') as f:
                f.write(contents)
            documents = document_loader.load(path, 'pdf')

        if os.path.splitext(file.filename)[1] in [".jpg", ".jpeg", ".png", ".gif", "tiff", "bmp", "webp", "tif"]:
            image = Image.open(io.BytesIO(contents))
            image = image.convert("RGB")
            image.save(path, format='JPEG')
            documents = document_loader.load(path, 'image')
    except Exception as e:
        return {"error": str(e)}

    for doc in documents:
        doc.metadata = {
            "id": id,
            "tags": tags,
            "filename": file.filename
        }
        pipeline.insert(doc)

    return {"document": "ok"}


@app.get("/ping")
def ping():
    return {"ping": "pong"}


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = os.getenv("PORT", 8000)
    uvicorn.run(app, host=host, port=port)

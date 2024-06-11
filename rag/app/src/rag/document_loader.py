import os.path

import ocrmypdf
from langchain_core.documents import Document
import os

import pymupdf4llm
from langchain.text_splitter import MarkdownTextSplitter


class DocumentLoader:
    def __init__(self):
        chunk_size = int(os.environ.get("TEXT_SPLITTER_CHUNK_SIZE"))
        overlap_size = int(os.environ.get("TEXT_SPLITTER_OVERLAP_SIZE"))
        self.text_splitter = MarkdownTextSplitter(chunk_size=chunk_size, chunk_overlap=overlap_size)

    def load(self, path, type) -> Document:
        method = {
            'pdf': lambda d: self.load_pdf(d) + self.load_scanned_pdf(d),
            'image': self.load_image,
        }
        documents = method[type](path)
        return documents

    def load_pdf(self, path):
        markdown_text = pymupdf4llm.to_markdown(path)
        documents = self.text_splitter.create_documents([markdown_text])
        return documents

    def load_image(self, path):
        path_out = os.path.splitext(path)[0] + '.pdf'
        ocrmypdf.ocr(
            input_file=path,
            output_file=path_out,
            output_type='pdf',
            force_ocr=True,
            language='eng+fra',
            clean=True,
            clean_final=True,
            deskew=True,
            rotate_pages=True,
            image_dpi=100,
        )
        return self.load_pdf(path_out)

    def load_scanned_pdf(self, path):
        ocrmypdf.ocr(
            input_file=path,
            output_file=path,
            output_type='pdf',
            force_ocr=True,
            language='eng+fra',
            clean=True,
            clean_final=True,
            deskew=True,
            invalidate_digital_signatures=True,
        )
        return self.load_pdf(path)

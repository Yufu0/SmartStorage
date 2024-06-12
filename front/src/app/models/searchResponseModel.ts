import {DocumentModel} from "./documentModel";

export class SearchResponseModel {
    answer: string;
    documents: DocumentModel[];

    constructor(answer: string, documents: DocumentModel[]) {
        this.answer = answer;
        this.documents = documents;
    }
}

import {TagModel} from "./tagModel";

export class DocumentModel {

    private _filename: string = '';

    fileId: string;
    extension: string;
    tags: TagModel[];

    constructor(fileId: string, filename: string, extension: string, tags: TagModel[] = []) {
        this.fileId = fileId;
        this.filename = filename;
        this.extension = extension;
        this.tags = tags;
    }

    get filename(): string {
        return this._filename;
    }

    set filename(value: string) {
        this._filename = value
            .normalize("NFD")
            .replaceAll(/\p{Diacritic}/gu, "")
            .replaceAll(" ", "_");
    }
}

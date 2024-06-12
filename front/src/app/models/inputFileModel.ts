import {TagModel} from "./tagModel";

export class InputFileModel {

    private _name: string = '';
    file: File;
    tags: TagModel[];

    constructor(file: File, name: string = '', tags: TagModel[] = []) {
        this.file = file;
        this.name = name || file.name;
        this.tags = tags;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value
            .normalize("NFD")
            .replaceAll(/\p{Diacritic}/gu, "")
            .replaceAll(" ", "_");
    }

    toJSON(): {name: string, tags: TagModel[]} {
        return {
            name: this._name,
            tags: this.tags
        };
    }
}

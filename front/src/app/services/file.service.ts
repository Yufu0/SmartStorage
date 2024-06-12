import {Injectable} from '@angular/core';
import {InputFileModel} from "../models/inputFileModel";
import {HttpClient} from "@angular/common/http";
import {TagModel} from "../models/tagModel";
import {map, Observable} from "rxjs";
import {SearchResponseModel} from "../models/searchResponseModel";
import {environment} from "../Environment";
import {DocumentModel} from "../models/documentModel";

const baseUrl = environment.serverBaseUrl + '/api/files';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private http: HttpClient) {
    }

    uploadFiles(inputFiles: InputFileModel[]) {

        const formData: FormData = new FormData();

        inputFiles.forEach((inputFile, index) => {
            formData.append('files', inputFile.file, inputFile.name);
        });

        const metadata: { name: string; tags: TagModel[] }[] = inputFiles.map(inputFile => inputFile.toJSON());
        formData.append('metadata', JSON.stringify(metadata));


        return this.http.post(baseUrl + '/upload', formData);
    }

    updateFile(file: DocumentModel) {
        const body = {
            fileId: file.fileId,
            filename: file.filename,
            tags: file.tags
        }

        return this.http.post(baseUrl + '/update', body);
    }

    deleteFile(fileId: string) {
        const params = {
            fileId: fileId
        }

        return this.http.delete(baseUrl + '/delete', {params: params});
    }

    searchFiles(fileName: string, tags: TagModel[]): Observable<SearchResponseModel> {
        const params = {
            name: fileName,
            tags: tags.map((tag: TagModel) => tag.label).join(',')
        }

        return this.http.get<SearchResponseModel>(baseUrl + '/search', {params: params}).pipe(
            map((response: SearchResponseModel) => {
                response.documents = response.documents.map((document: DocumentModel) => {
                    return new DocumentModel(document.fileId, document.filename, document.extension, document.tags);
                });
                return response;
            })
        );
    }

    searchFilesWithRAG(query: string, tags: TagModel[]): Observable<SearchResponseModel> {
        const params = {
            query: query,
            tags: tags.map((tag: TagModel) => tag.label).join(',')
        }

        return this.http.get<SearchResponseModel>(baseUrl + '/searchRAG', {params: params}).pipe(
            map((response: SearchResponseModel) => {
                response.documents = response.documents.map((document: DocumentModel) => {
                    return new DocumentModel(document.fileId, document.filename, document.extension, document.tags);
                });
                return response;
            })
        );
    }

    downloadFile(fileId: string, filename: string): Observable<Blob> {
        const params = {
            fileId: fileId,
            filename: filename
        }

        return this.http.get(baseUrl + '/download', {responseType: 'blob', params: params});
    }
}

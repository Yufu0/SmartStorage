import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../Environment";
import {LogModel} from "../models/logModel";
import {Observable} from "rxjs";

const baseUrl = environment.serverBaseUrl + '/api/logs';

@Injectable({
    providedIn: 'root'
})
export class LogsService {
    constructor(private http: HttpClient) {
    }

    getLogs(): Observable<LogModel[]> {
        return this.http.get<LogModel[]>(baseUrl);
    }
}

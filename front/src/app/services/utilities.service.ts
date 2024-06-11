import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../Environment";
import {PingResponseModel} from "../models/pingResponseModel";

const baseUrl: string = environment.serverBaseUrl + '/ping';

@Injectable({
    providedIn: 'root'
})
export class UtilitiesService {

    constructor(private http: HttpClient) {
    }

    documentClickedTarget: Subject<HTMLElement> = new Subject<HTMLElement>()
    applicationStatus: Subject<boolean> = new Subject<boolean>();
    ragStatus: Subject<boolean> = new Subject<boolean>();

    ping(): void {
        this.callPing('/api').subscribe((status: boolean) => {
            this.applicationStatus.next(status);
        });

        this.callPing('/rag').subscribe((status: boolean) => {
            this.ragStatus.next(status);
        });
    }

    private callPing(route: string): Observable<boolean> {
        return this.http.get<PingResponseModel>(baseUrl + route).pipe(
            map((response: PingResponseModel) => response && response.message === 'pong'),
            catchError(() => of(false))
        );
    }
}

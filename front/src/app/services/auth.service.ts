import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../Environment";

const baseUrl = environment.serverBaseUrl + '/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {

        const body = {
            username: username,
            password: password
        }

        return this.http.post(baseUrl + '/login', body)
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

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

        return this.http.post('http://localhost:8080/auth/login', body/*, httpOptions*/)
    }
}

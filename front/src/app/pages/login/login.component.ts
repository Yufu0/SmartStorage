import {Component, HostListener} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";
import {InputLoginComponent} from "../../components/input-login/input-login.component";
import {TagsService} from "../../services/tags.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        NgClass,
        InputLoginComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    username: string = '';
    password: string = '';

    constructor(private authService: AuthService, private tagsService: TagsService, private router: Router) {
    }

    login() {
        this.authService.login(this.username, this.password).subscribe({
            next: (response) => {
                this.tagsService.fetchTags();
                this.router.navigate(['/home']);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}

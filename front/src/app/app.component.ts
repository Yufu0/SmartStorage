import {Component, HostListener, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {StatusComponent} from "./components/status/status.component";
import {UtilitiesService} from "./services/utilities.service";
import {TagsService} from "./services/tags.service";
import {WebsocketService} from "./services/websocket.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, LoginComponent, StatusComponent, RouterLink],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

    isLightMode: boolean = false;

    constructor(
        public utilitiesService: UtilitiesService,
        private tagService: TagsService,
        private webSocketService: WebsocketService) {
    }

    @HostListener('document:click', ['$event'])
    documentClick(event: any): void {
        this.utilitiesService.documentClickedTarget.next(event.target)
    }

    ngOnInit() {
        this.tagService.fetchTags();
        this.utilitiesService.ping();

        this.webSocketService.openWebSocket();
        this.webSocketService.connect();

        setInterval(() => this.utilitiesService.ping(), 5000);
    }

    switchMode() {
        document.documentElement.classList.toggle('light');
        this.isLightMode = !this.isLightMode;
    }
}

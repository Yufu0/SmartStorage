import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    private webSocket?: WebSocket;

    constructor() {
    }

    openWebSocket(): void {
        this.webSocket = new WebSocket('ws://localhost:8080/ws');
        this.webSocket.onopen = (event) => {
            console.info('WebSocket is open now.');
        }
    }

    closeWebSocket(): void {
        if(this.webSocket === undefined) {
            console.error('WebSocket is not open.');
            return;
        }
        this.webSocket.close();
        this.webSocket = undefined;
        console.info('WebSocket is closed now.');
    }

    connect(): void {
        if(this.webSocket === undefined) {
            console.error('WebSocket is not open.');
            return;
        }
        this.webSocket.onmessage = (event) => {
            console.info('Received message: ' + event.data);
        }
    }
}

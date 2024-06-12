import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {Subject} from "rxjs";

@Component({
    selector: 'app-status',
    standalone: true,
    imports: [
        NgClass,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault
    ],
    templateUrl: './status.component.html',
    styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit {

    @Input() subject: Subject<boolean> = new Subject<boolean>();
    @Input() label: string = '';

    status: Status = Status.DISCONNECTED;

    constructor() {}

    ngOnInit() {
        this.subject.subscribe(status => {
            this.status = status ? Status.CONNECTED : Status.DISCONNECTED;
        });
    }

    protected readonly Status = Status;
}

export enum Status {
    DISCONNECTED = 'disconnected',
    CONNECTED = 'connected'
}

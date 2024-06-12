import {Component, OnInit} from '@angular/core';
import {LogModel} from "../../models/logModel";
import {LogsService} from "../../services/logs.service";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-logs',
    standalone: true,
    imports: [
        NgForOf,
        NgClass,
        DatePipe,
        RouterLink
    ],
    templateUrl: './logs.component.html',
    styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {

    logs: LogModel[] = [];

    constructor(private logsService: LogsService) {
    }

    ngOnInit() {
        this.logsService.getLogs().subscribe(logs => {
            this.logs = logs;
        });
    }
}

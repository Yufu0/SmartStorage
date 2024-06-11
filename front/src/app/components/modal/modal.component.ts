import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {

    display: boolean = false;

    constructor(private modalService: ModalService) {
    }

    ngOnInit() {
        this.modalService.hasLoader.subscribe(hasLoader => {
            this.display = hasLoader;
        });
    }
}

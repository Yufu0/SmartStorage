import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UtilitiesService} from "../../services/utilities.service";

@Component({
    selector: 'app-input-login',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './input-login.component.html',
    styleUrl: './input-login.component.css'
})
export class InputLoginComponent implements OnInit {

    @ViewChild('input', {read: ElementRef, static: false}) input: ElementRef | undefined;

    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() fieldValue: string = '';

    focus: boolean = false;

    @Output() fieldValueEvent = new EventEmitter<string>();

    constructor(private utilitiesService: UtilitiesService) {
    }

    ngOnInit() {
        this.focus = this.fieldValue !== '';
        this.utilitiesService.documentClickedTarget.subscribe(target => {
            this.focus = this.input && this.input.nativeElement.contains(target) || this.fieldValue !== '';
        });
    }

    onValueChange() {
        this.fieldValueEvent.emit(this.fieldValue);
        this.focus = this.fieldValue !== '';
    }

    onFocus() {
        this.focus = true;
    }
}

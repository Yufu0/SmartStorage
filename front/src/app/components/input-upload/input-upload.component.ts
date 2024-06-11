import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UtilitiesService} from "../../services/utilities.service";

@Component({
    selector: 'app-input-upload',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './input-upload.component.html',
    styleUrl: './input-upload.component.css'
})
export class InputUploadComponent implements OnInit {

    @ViewChild('input', {read: ElementRef, static: false}) input: ElementRef | undefined;

    @Input() placeholder: string = '';
    @Input() type: string = 'text';

    @Input() fieldValue: string = '';
    @Output() fieldValueChange = new EventEmitter<string>();
    @Output() onSubmit = new EventEmitter<void>();

    focus: boolean = false;
    constructor(private utilitiesService: UtilitiesService) {}

    ngOnInit() {
        this.focus = this.fieldValue !== '';
        this.utilitiesService.documentClickedTarget.subscribe(target => {
            this.focus = this.input && this.input.nativeElement.contains(target) || this.fieldValue !== '';
        });
    }

    onValueChange() {
        this.fieldValueChange.emit(this.fieldValue);
        this.focus = this.fieldValue !== '';
    }

    onFocus() {
        this.focus = true;
    }

    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.onSubmit.emit();
            this.fieldValue = '';
        }
    }
}

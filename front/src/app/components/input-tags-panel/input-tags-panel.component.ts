import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ColorPickerComponent} from "../color-picker/color-picker.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TagColors, TagModel} from "../../models/tagModel";
import {UtilitiesService} from "../../services/utilities.service";

@Component({
    selector: 'app-input-tags-panel',
    standalone: true,
    imports: [
        ColorPickerComponent,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './input-tags-panel.component.html',
    styleUrl: './input-tags-panel.component.css'
})
export class InputTagsPanelComponent {
    @ViewChild('input', {read: ElementRef, static: false}) input: ElementRef | undefined;

    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() tag: TagModel = new TagModel('');

    @Output() tagChange: EventEmitter<TagModel> = new EventEmitter<TagModel>();
    @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();

    focus: boolean = false;

    constructor(private utilitiesService: UtilitiesService) {
    }

    ngOnInit() {
        this.focus = this.tag !== undefined /*&& this.tag.label !== ''*/;
        this.utilitiesService.documentClickedTarget.subscribe(target => {
            this.focus = this.input && this.input.nativeElement.contains(target) /*|| this.tag.label !== ''*/;
        });
    }

    onValueChange() {
        this.tagChange.emit(this.tag);
        this.focus = this.tag !== undefined && this.tag.label !== '';
    }

    onFocus() {
        this.focus = true;
    }

    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.onSubmit.emit();
            this.tag = new TagModel('');
        }
    }

    onColorSelected(color: TagColors) {
        this.tag.color = color;
    }
}

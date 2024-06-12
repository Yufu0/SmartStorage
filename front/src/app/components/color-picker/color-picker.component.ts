import {Component, EventEmitter, Output} from '@angular/core';
import {TagColors} from "../../models/tagModel";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-color-picker',
    standalone: true,
    imports: [
        NgForOf,
        NgIf
    ],
    templateUrl: './color-picker.component.html',
    styleUrl: './color-picker.component.css'
})
export class ColorPickerComponent {

    @Output() onSelect: EventEmitter<TagColors> = new EventEmitter<TagColors>();

    colors: TagColors[] = Object.values(TagColors);
    currentColor: TagColors = this.colors[0];

    constructor() {
    }

    onColorSelected(color: TagColors) {
        this.currentColor = color;
        this.onSelect.emit(this.currentColor);
    }
}

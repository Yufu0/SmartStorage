import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-slider-rag',
  standalone: true,
  imports: [],
  templateUrl: './slider-rag.component.html',
  styleUrl: './slider-rag.component.css'
})
export class SliderRagComponent {

    @Input() state: boolean = false;
    @Output() stateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onChanges: EventEmitter<boolean> = new EventEmitter<boolean>();

    toggle() {
        this.state = !this.state;
        this.stateChange.emit(this.state);
        this.onChanges.emit(this.state);
    }
}

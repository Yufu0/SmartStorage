import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TagModel} from "../../models/tagModel";
import {UtilitiesService} from "../../services/utilities.service";

@Component({
    selector: 'app-select-tag',
    standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        NgIf
    ],
    templateUrl: './select-tag.component.html',
    styleUrl: './select-tag.component.css'
})
export class SelectTagComponent implements OnInit {

    @ViewChild('input', {read: ElementRef, static: false}) input: ElementRef | undefined;

    @Input() tagsList: TagModel[] = [];
    @Input() filterTags: TagModel[] = [];
    @Input() inDarkBackground: boolean = false;
    @Input() placeholder: string = '';
    @Output() onSubmit: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    isExpanded: boolean = false;
    currentTagLabel: string = '';

    constructor(private utilitiesService: UtilitiesService) {
    }

    ngOnInit(): void {
        this.utilitiesService.documentClickedTarget.subscribe(target => {
            this.isExpanded = this.isExpanded && this.input && this.input.nativeElement.contains(target);
        });
    }


    onValueChange() {
        this.isExpanded = this.getFilteredTags().length > 0;
    }

    onTagSelected(tag: TagModel) {
        this.onSubmit.emit(tag);
        this.isExpanded = false;
        this.currentTagLabel = '';
    }

    getFilteredTags(): TagModel[] {
        return this.tagsList.filter((field: TagModel) => !this.filterTags.map((tag: TagModel) => tag.label).includes(field.label) && field.label.includes(this.currentTagLabel));
    }

    onClick() {
        this.isExpanded = !this.isExpanded;
    }
}

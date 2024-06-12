import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InputUploadComponent} from "../input-upload/input-upload.component";
import {NgForOf} from "@angular/common";
import {SelectTagComponent} from "../select-tag/select-tag.component";
import {InputFileModel} from "../../models/inputFileModel";
import {TagModel} from "../../models/tagModel";

@Component({
    selector: 'app-document-upload',
    standalone: true,
    imports: [
        InputUploadComponent,
        NgForOf,
        SelectTagComponent
    ],
    templateUrl: './document-upload.component.html',
    styleUrl: './document-upload.component.css'
})
export class DocumentUploadComponent {

    isHovered: boolean = false;

    @Input() file: InputFileModel = new InputFileModel(new File([], ''));
    @Input() tagsList: TagModel[] = [];
    @Output() fileChange = new EventEmitter<InputFileModel>();
    @Output() destroy = new EventEmitter<void>();

    onMouseEnter() {
        this.isHovered = true;
    }

    onMouseLeave() {
        this.isHovered = false;
    }

    removeFile() {
        this.destroy.emit();
    }

    addTag(tag: TagModel) {
        if (this.file && tag) {
            this.file.tags.push(tag);
            this.updateFile();
        }
    }

    removeTag(tag: TagModel) {
        if (this.file) {
            this.file.tags = this.file.tags.filter((t: TagModel) => t !== tag);
            this.updateFile();
        }
    }

    private updateFile() {
        this.fileChange.emit(this.file);
    }
}

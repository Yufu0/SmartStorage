import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {InputFileModel} from "../../models/inputFileModel";
import {TagModel} from "../../models/tagModel";
import {FileService} from "../../services/file.service";
import {TagsService} from "../../services/tags.service";
import {DocumentUploadComponent} from "../../components/document-upload/document-upload.component";
import {ModalService} from "../../services/modal.service";

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        DocumentUploadComponent
    ],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {

    files: InputFileModel[] = [];
    tagsList: TagModel[] = [];

    dragOver: boolean = false;

    constructor(private fileService: FileService, private tagService: TagsService, private modalService: ModalService) {
    }

    ngOnInit() {
        this.tagService.tags.subscribe(tags => {
            this.tagsList = tags;
        });
    }

    onDrop(event: any) {
        event.preventDefault();
        this.dragOver = false;
        for (let i = 0; i < event.dataTransfer.files.length; i++)
            this.files.push(new InputFileModel(event.dataTransfer.files[i]));
    }

    onDragOver(event: any): void {
        event.preventDefault();
        this.dragOver = true;
    }

    onDragLeave(event: any) {
        event.preventDefault();
        this.dragOver = false;
    }

    onDragEnd(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = false;
    }

    onFileSelected(event: any) {
        this.dragOver = false;
        for (let i = 0; i < event.target.files.length; i++)
            this.files.push(new InputFileModel(event.target.files[i]));
    }

    removeFile(file: InputFileModel) {
        this.files = this.files.filter((f) => f !== file);
    }

    upload() {
        this.modalService.showLoader();
        this.fileService.uploadFiles(this.files).subscribe({
            next: (response) => {
                this.files = [];
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => {
                this.modalService.hideLoader();
            }
        });
    }

    clear() {
        this.files = [];
    }
}

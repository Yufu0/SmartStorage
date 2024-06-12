import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TagModel} from "../../models/tagModel";
import {DocumentModel} from "../../models/documentModel";
import {FileService} from "../../services/file.service";
import {lastValueFrom} from "rxjs";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {InputUploadComponent} from "../input-upload/input-upload.component";
import {SelectTagComponent} from "../select-tag/select-tag.component";

@Component({
    selector: 'app-document',
    standalone: true,
    imports: [
        NgForOf,
        InputUploadComponent,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        SelectTagComponent
    ],
    templateUrl: './document.component.html',
    styleUrl: './document.component.css'
})
export class DocumentComponent {

    @Input() tagsList: TagModel[] = [];
    @Input() document: DocumentModel = new DocumentModel('', '', '', []);
    @Output() documentChange: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();
    @Output() destroy: EventEmitter<void> = new EventEmitter<void>();

    status: DocumentStatus = DocumentStatus.DEFAULT;
    documentTpm: DocumentModel = new DocumentModel('', '', '', []);

    // tagsTmp: TagModel[] = [];
    // filenameTmp: string = '';
    blob: Blob | undefined;

    constructor(private fileService: FileService) {
    }

    onMouseEnter() {
        if(this.status === DocumentStatus.DEFAULT)
            this.status = DocumentStatus.HOVERED;
    }

    onMouseLeave() {
        if(this.status === DocumentStatus.HOVERED)
            this.status = DocumentStatus.DEFAULT;
    }

    async onFileInteraction(interaction: string) {
        if(!this.blob)
            this.blob = await lastValueFrom(this.fileService.downloadFile(this.document.fileId, this.document.filename));

        const fileType = this.blob.type;
        const url = window.URL.createObjectURL(this.blob);

        switch (interaction) {
            case 'download':
                this.download(url);
                break;
            case 'visualize':
                this.visualize(url, fileType);
                break;
        }
    }

    download(url: string) {
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = url;
        a.download = this.document.filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    visualize(url: string, fileType: string) {
        switch (fileType) {
            case 'application/pdf':
                window.open(url);
                break;
            case 'image/png':
                window.open(url);
                break;
        }
    }

    addTag(tag: TagModel) {
        if (this.document && tag) {
            this.document.tags.push(tag);
            this.updateFile();
        }
    }

    removeTag(tag: TagModel) {
        if (this.document) {
            this.document.tags = this.document.tags.filter((t: TagModel) => t !== tag);
            this.updateFile();
        }
    }

    edit() {
        this.status = DocumentStatus.EDIT;
        this.documentTpm = new DocumentModel(this.document.fileId, this.document.filename, this.document.extension, Object.assign([], this.document.tags));
    }

    saveChange() {
        this.status = DocumentStatus.DEFAULT;
        this.fileService.updateFile(this.document).subscribe(() => {
            this.updateFile();
        });
    }

    discardChange() {
        console.log(this.documentTpm)
        this.status = DocumentStatus.DEFAULT;
        this.document = this.documentTpm;
    }

    delete() {
        this.fileService.deleteFile(this.document.fileId).subscribe(() => {
            this.destroy.emit();
        });
    }

    private updateFile() {
        this.documentChange.emit(this.document);
    }

    protected readonly DocumentStatus = DocumentStatus;
}

export enum DocumentStatus {
    DEFAULT = 'DEFAULT',
    HOVERED = 'HOVERED',
    EDIT = 'EDIT'
}

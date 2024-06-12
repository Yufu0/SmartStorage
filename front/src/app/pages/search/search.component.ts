import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TagModel} from "../../models/tagModel";
import {FileService} from "../../services/file.service";
import {TagsService} from "../../services/tags.service";
import {SliderRagComponent} from "../../components/slider-rag/slider-rag.component";
import {SelectTagComponent} from "../../components/select-tag/select-tag.component";
import {SearchResponseModel} from "../../models/searchResponseModel";
import {DocumentComponent} from "../../components/document/document.component";
import {DocumentModel} from "../../models/documentModel";
import {ModalService} from "../../services/modal.service";

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        SliderRagComponent,
        SelectTagComponent,
        NgIf,
        DocumentComponent
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

    filterName: string = '';
    filterTags: TagModel[] = [];

    tagsList: TagModel[] = [];

    hasRAG: boolean = false;

    searchResponse: SearchResponseModel = new SearchResponseModel('', []);

    constructor(private fileService: FileService, private tagService: TagsService, private modalService: ModalService) {
    }

    ngOnInit() {
        this.tagService.tags.subscribe(tags => {
            this.tagsList = tags;
        });
        this.search(true);
    }

    onSelectTag(tag: TagModel) {
        this.filterTags.push(tag);
        this.search(true);
    }

    search(autoSearch: boolean = false) {
        if(!this.hasRAG) {
            this.modalService.showLoader();
            this.fileService.searchFiles(this.filterName, this.filterTags).subscribe((searchResponse: SearchResponseModel) => {
                this.modalService.hideLoader();
                searchResponse.documents = searchResponse.documents.sort((a, b) => a.filename.localeCompare(b.filename));
                this.searchResponse = searchResponse;
            });
        }
        if(this.hasRAG && !autoSearch && this.filterName !== ''){
            this.modalService.showLoader();
            this.fileService.searchFilesWithRAG(this.filterName, this.filterTags).subscribe((searchResponse: SearchResponseModel) => {
                this.modalService.hideLoader();
                searchResponse.documents = searchResponse.documents.sort((a, b) => a.filename.localeCompare(b.filename));
                this.searchResponse = searchResponse;
            });
        }
    }

    onChange() {
        if(this.filterName === '' && this.filterTags.length === 0)
            return;
        this.search(true);
    }

    removeTag(tag: TagModel) {
        this.filterTags = this.filterTags.filter(t => t.label !== tag.label);
        this.search(true);
    }

    onDocumentDestroy(document: DocumentModel) {
        this.searchResponse.documents = this.searchResponse.documents.filter(d => d.filename !== document.filename);
    }

    onSliderChange(hisCurrentlyWithRag: boolean) {
        if(hisCurrentlyWithRag)
            this.searchResponse = new SearchResponseModel('', []);
        else
            this.search(true);
    }
}

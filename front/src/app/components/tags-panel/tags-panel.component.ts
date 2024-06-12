import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {InputUploadComponent} from "../input-upload/input-upload.component";
import {NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {TagsService} from "../../services/tags.service";
import {TagModel, TagColors} from "../../models/tagModel";
import {InputTagsPanelComponent} from "../input-tags-panel/input-tags-panel.component";

@Component({
    selector: 'app-tags-panel',
    standalone: true,
    imports: [
        InputUploadComponent,
        NgForOf,
        NgSwitch,
        NgSwitchCase,
        InputTagsPanelComponent
    ],
    templateUrl: './tags-panel.component.html',
    styleUrl: './tags-panel.component.css'
})
export class TagsPanelComponent implements OnInit {

    tags: TagModel[] = [];

    newTag: TagModel = new TagModel('');

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    constructor(private tagsService: TagsService) {
    }

    ngOnInit() {
        this.tagsService.tags.subscribe(tags => {
            this.tags = tags;
        });
    }

    addTag() {
        this.tagsService.addTag(this.newTag);
        this.newTag = new TagModel('');
    }

    removeTag(tag: TagModel) {
        this.tagsService.deleteTag(tag.label);
    }

    closePanel() {
        this.onClose.emit();
    }

    protected readonly TagColors = TagColors;
}

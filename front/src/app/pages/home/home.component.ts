import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {TagsPanelComponent} from "../../components/tags-panel/tags-panel.component";
import {NgIf} from "@angular/common";
import {ModalComponent} from "../../components/modal/modal.component";
import {UtilitiesService} from "../../services/utilities.service";
import {EPage} from "../../enums/EPage";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterLink,
        RouterOutlet,
        TagsPanelComponent,
        NgIf,
        ModalComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements AfterContentInit {

    isDirty: boolean = false;
    hasTagsPanel: boolean = false;
    currentPage: EPage | undefined;

    constructor(private router: Router) {}

    ngAfterContentInit() {
        const urlFragments: string[] = this.router.url.split('/');
        switch (urlFragments[urlFragments.length - 1]) {
            case EPage.SEARCH:
                this.currentPage = EPage.SEARCH;
                break;
            case EPage.UPLOAD:
                this.currentPage = EPage.UPLOAD;
                break;
            default:
                this.currentPage = EPage.DEFAULT;
        }
    }

    showTagsPanel() {
        this.hasTagsPanel = true;
        this.isDirty = true;
    }

    hideTagsPanel() {
        this.hasTagsPanel = false;
    }

    changeCurrentPage(page: EPage) {
        this.currentPage = page;
    }

    protected readonly EPage = EPage;
}

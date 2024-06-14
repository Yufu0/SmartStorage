import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {TagModel} from "../models/tagModel";
import {environment} from "../Environment";

const baseUrl = environment.serverBaseUrl + '/api/tags';

@Injectable({
    providedIn: 'root'
})
export class TagsService {

    tags: BehaviorSubject<TagModel[]> = new BehaviorSubject<TagModel[]>([]);

    constructor(private http: HttpClient) {
        this.tags.subscribe(tags => {
            console.log(tags);
        })
    }

    fetchTags(): void {
        this.http.get<TagModel[]>(baseUrl).subscribe(tags => {
            this.tags.next(tags);
        });
    }

    addTag(tag: TagModel): void {
        this.http.post<void>(baseUrl + '/add', tag).subscribe(() => {
            this.tags.next([...this.tags.getValue(), tag]);
        });
    }

    deleteTag(label: string): void {
        this.http.post<void>(baseUrl + '/delete', label).subscribe(() => {
            this.tags.next(this.tags.getValue().filter(tag => tag.label !== label));
        });
    }
}

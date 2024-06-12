import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {TagModel} from "../models/tagModel";

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
        this.http.get<TagModel[]>('http://localhost:8080/api/tags').subscribe(tags => {
            this.tags.next(tags);
        });
    }

    addTag(tag: TagModel): void {
        this.http.post<void>('http://localhost:8080/api/tags/add', tag).subscribe(() => {
            this.tags.next([...this.tags.getValue(), tag]);
        });
    }

    deleteTag(label: string): void {
        this.http.post<void>('http://localhost:8080/api/tags/delete', label).subscribe(() => {
            this.tags.next(this.tags.getValue().filter(tag => tag.label !== label));
        });
    }
}

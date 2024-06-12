import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    hasLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {
    }

    showLoader() {
        this.hasLoader.next(true);
    }

    hideLoader() {
        this.hasLoader.next(false);
    }
}

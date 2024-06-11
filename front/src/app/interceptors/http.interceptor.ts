import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {Router} from "@angular/router";
import {inject} from "@angular/core";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

    const router = inject(Router);

    const newReq = req.clone({
        withCredentials: true
    });

    return next(newReq).pipe(
        catchError((error) => {
            if (error.status === 401) {
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};

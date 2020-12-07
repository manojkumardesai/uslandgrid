
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { ApiService } from "../api.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public apiService: ApiService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.apiService.show();
        return next.handle(req).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpRequest) {
                    this.apiService.show();
                }
                if (event instanceof HttpResponse) {
                    this.apiService.hide();

                }
            },
                (err: any) => {
                    this.apiService.hide()
                })
        );
    }
}
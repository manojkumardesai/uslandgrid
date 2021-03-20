
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
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
                    if(event.body.statusCode == 513) {
                        this.logout();
                    }
                    this.apiService.hide();
                }
            },
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            this.logout();
                        }
                    }
                    this.apiService.hide();
                })
        );
    }

    logout() {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('loginToken');
        window.location.reload(true);
    }
}
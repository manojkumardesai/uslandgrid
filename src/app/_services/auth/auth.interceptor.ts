import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../login.service";
import { Observable } from "rxjs";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    token = 'Bearer ' + localStorage.getItem('loginToken');

    constructor(private loginService: LoginService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.loginService.isloggedin()) {
            const authToken = this.token;
            req = req.clone({
                headers: req.headers.set(
                    'Authorization',
                    this.token
                )
            })

        }

        return next.handle(req);
    }

}
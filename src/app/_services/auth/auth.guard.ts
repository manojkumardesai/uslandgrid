import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    // Inject Router so we can hand off the user to the Login Page 
    constructor(private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (sessionStorage.getItem('userInfo')) {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            if (userInfo && userInfo.role == 'ADMIN') {
                return true;
            } else {
                this.router.navigate(['user-auth/login']);
                return false;

            }

        }

    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = environment.baseUrl;
  user = new BehaviorSubject<any>(null);
  headers = new HttpHeaders().set('content-type', 'application/json').set('Access-Control-Allow-Origin', '*')
    .set('Cache-Control', ' no-cache').set('Accept', '*/*').set('Accept-Encoding', 'gzip, deflate, br');
  constructor(private http: HttpClient) { }

  public publishLoginResponseTrue(): void {
    const user = {
      loggedIn: true
    };
    this.user.next(user);
    sessionStorage.setItem('logInState', 'true');
  }

  public publishLoginResponseFalse(): void {
    const user = {
      loggedIn: false
    };
    this.user.next(user);
    sessionStorage.removeItem('logInState');
  }

  isloggedin() {
    return localStorage.getItem('loginToken') !== null ? true : false;
  }

  isAdmin() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo && userInfo.role == 'ADMIN' ? true : false;
  }



}

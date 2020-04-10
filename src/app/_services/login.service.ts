import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user = new BehaviorSubject<any>(null);

  constructor() { }

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
}

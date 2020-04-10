import { Component, OnInit } from '@angular/core';
import { LoginService } from './_services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'US Land Grid';
  isLoggedIn = false;
  constructor(public loginService: LoginService, public router: Router) {

  }

  ngOnInit() {
    this.autoLogin();
    this.loginService.user.subscribe((data) => {
      this.isLoggedIn = data && data.loggedIn ? data.loggedIn : false;
    });
  }

  autoLogin() {
    const loginState = sessionStorage.getItem('logInState');
    if (loginState) {
      this.loginService.publishLoginResponseTrue();
    }
  }
  routeToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } })
  }

}

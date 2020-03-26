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
    this.loginService.user.subscribe((data) => {
      this.isLoggedIn = data && data.loggedIn ? data.loggedIn  : false;
  });
  }

  routeToLogin() {
    this.router.navigate(['/login'], {queryParams : {returnUrl : this.router.routerState.snapshot.url}})
  }

}

import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  constructor(public loginService: LoginService, public router: Router) { }

  ngOnInit() {
    this.loginService.user.subscribe((data) => {
      this.isLoggedIn = data && data.loggedIn ? data.loggedIn : false;
    });
  }

  routeToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } })
  }

}

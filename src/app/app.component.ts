import { Component, OnInit } from '@angular/core';
import { LoginService } from './_services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'US Land Grid';
  isLoggedIn = false;
  constructor(public loginService: LoginService) {

  }

  ngOnInit() {
    this.loginService.user.subscribe((data) => {
      this.isLoggedIn = data && data.loggedIn ? data.loggedIn  : false;
  });
  }

}

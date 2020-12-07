import { Component, OnInit } from '@angular/core';
import { LoginService } from './_services/login.service';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'US Land Grid';
  isLoggedIn = false;
  constructor(public loginService: LoginService, public router: Router,
    private userIdle: UserIdleService, public _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    let time = 0;
    this.autoLogin();
    this.loginService.user.subscribe((data) => {
      this.isLoggedIn = data && data.loggedIn ? data.loggedIn : false;
    });

    //Start watching for user inactivity.
    this.userIdle.startWatching();
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => {
      time = time + count;
    });
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      console.log('Time is up!');
      if (this.loginService.isloggedin()) {
        this.logout();
      }

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

  logout() {
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('loginToken');
    // this.router.navigate(['/home']);
    window.location.reload(true);
    this.openSnackBar('Logged out successfully', 'Dismiss');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}

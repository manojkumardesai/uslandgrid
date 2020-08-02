import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MapLegendComponent } from '../map-legend/map-legend.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  constructor(public loginService: LoginService, public router: Router,
    public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loginService.user.subscribe((data) => {
      this.isLoggedIn = data && data.loggedIn ? data.loggedIn : false;
    });
  }

  routeToLogin() {
    this.router.navigate(['/user-auth'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } })
  }

  openLegends() {
    const dialogRef = this.dialog.open(MapLegendComponent, {
      hasBackdrop: false,
      position: {
        top: '55px',
        right: '2px'
      }
    });
    dialogRef.afterClosed().subscribe(console.log);
  }


  logout() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('loginToken');
    this.router.navigate(['/home']);
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

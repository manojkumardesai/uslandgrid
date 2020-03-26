import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
// import { LoginService } from './_services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    pwd: new FormControl(''),
  });
  @Input() error: string | null;

  constructor( private router: Router, public loginService: LoginService, public _snackBar: MatSnackBar,
                public activeRoute: ActivatedRoute) { }

  ngOnInit(): void {

  }

  login(): void {
    if (this.form.value.username == 'admin' && this.form.value.pwd == 'USLG7969!') {
      this.openSnackBar('Login success', 'Dismiss');
      this.loginService.publishLoginResponseTrue();
      let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl');
      this.router.navigate([returnUrl || '/home']);
    } else {
      this.loginService.publishLoginResponseFalse();
      this.error = 'Invalid username/password';
      this.form.reset();
      setTimeout(()=>{
        this.error = '';
      }, 3000);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

}

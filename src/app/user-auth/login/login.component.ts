import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../_services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../_services/api.service';

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
  submitted: boolean = false;
  loginForm: FormGroup;
  constructor(private router: Router, public apiService: ApiService, public _snackBar: MatSnackBar,
    public activeRoute: ActivatedRoute, private loginService: LoginService) { }

  ngOnInit(): void {

    this.generateLoginForm();
  }

  generateLoginForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      pwd: new FormControl('', [Validators.required])
    });
  }

  submitLoginForm() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.apiService.login(JSON.stringify(this.loginForm.value)).subscribe((data) => {
      if (data['statusCode'] == 200 && data['message'] == 'Login successfully') {
        this.openSnackBar(data['message'], 'Dismiss');
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('loginToken', data['token']);
        let returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl || '/home']);
      }
      if (data['statusCode'] == 401) {
        this.openSnackBar(data['message'], 'Dismiss');
        this.loginForm.reset();
      }
    });
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
      setTimeout(() => {
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

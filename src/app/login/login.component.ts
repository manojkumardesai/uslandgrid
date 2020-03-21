import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
// import { LoginService } from './_services/login.service';
import { Router } from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { LoginService } from '../_services/login.service';

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

  constructor( private router: Router, public loginService: LoginService) { }

  ngOnInit(): void {
  }

  login(): void {
    console.log("hello");
    if (this.form.value.username == 'admin' && this.form.value.pwd == 'Parra7969!') {
      this.loginService.publishLoginResponseTrue();
      this.router.navigate(['/home']);
    } else {
      this.loginService.publishLoginResponseFalse();
      this.error = 'Invalid username/password';
      this.form.reset();
      setTimeout(()=>{
        this.error = '';
      }, 3000);
    }
  }

}

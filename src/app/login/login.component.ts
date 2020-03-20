import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
// import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

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

  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    this.form.controls.pwd.setValue(this.convertToBase64(this.form.controls.pwd.value));
    // this.loginService.login(this.form.value).subscribe((res) => {
    //   this.router.navigate(['/home']);
    // });
  }

  convertToBase64(inputValue): string {
    return btoa(inputValue); // JS built-in method for base64 conversion
  }

}

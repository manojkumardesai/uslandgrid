import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiService } from "../../_services/api.service";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
    selector: 'reset-component',
    templateUrl: './reset-password-component.html',
    styleUrls: ['./reset-password-component.scss']
})

export class ResetPasswordComponent {
    submitted: boolean = false;
    resetPasswordForm: FormGroup;
    isSuccess: boolean = false;
    isFailed: boolean = false;
    message: string = '';
    token: string;
    sub: any;

    constructor(private _activateRoute: ActivatedRoute, private _apiservice: ApiService,
        private router: Router,) {

    }

    ngOnInit() {
        this.resetPasswordForm = new FormGroup({
            newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
            confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
        });
        this.sub = this._activateRoute.queryParams.subscribe(params => {
            this.token = params['pwdToken'];
        });
    }

    submitResetPasswordForm() {
        this.submitted = true;
        if (this.resetPasswordForm.invalid) {
            return
        }
        let payload = {};
        payload['token'] = this.token;
        payload['resetPwd'] = this.resetPasswordForm.controls.newPassword.value;
        this._apiservice.changePassword(payload).subscribe(data => {
            if (data['statusCode'] == 200) {
                this.message = data['message'];
                this.isSuccess = true;
                setTimeout(() => {
                    this.router.navigate(['user-auth/login']);
                }, 1000);

            }
            if (data['statusCode'] == 400) {
                this.message = data['message'];
                this.isFailed = true;
                setTimeout(() => {
                    this.router.navigate(['user-auth/login']);
                }, 1000);

            }
        });
    }
}
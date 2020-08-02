import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiService } from "../../_services/api.service";


@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})


export class ForgotPasswordComponent implements OnInit {
    submitted: boolean = false;
    isSuccess: boolean = false;
    isFailed: boolean = false;
    message: string = '';
    forgotPasswordForm: FormGroup;

    constructor(private apiService: ApiService) { }
    ngOnInit() {
        this.forgotPasswordForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email])
        });
    }

    submitResetPasswordForm() {
        this.submitted = true;
        if (this.forgotPasswordForm.invalid) {
            return
        }
        this.apiService.forgotPassword(JSON.stringify(this.forgotPasswordForm.value)).subscribe(data => {
            if (data['statusCode'] == 200) {
                this.submitted = false;
                this.message = data['message'];
                this.isSuccess = true;
                this.forgotPasswordForm.reset();
            }
            if (data['statusCode'] == 400) {
                this.submitted = false;
                this.message = data['message'];
                this.isFailed = true;
                this.forgotPasswordForm.reset();
            }
        });
    }
}
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";


@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})


export class ForgotPasswordComponent implements OnInit {
    submitted: boolean = false;
    forgotPasswordForm: FormGroup;

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
    }
}
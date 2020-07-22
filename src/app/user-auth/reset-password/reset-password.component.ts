import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";


@Component({
    selector: 'reset-component',
    templateUrl: './reset-password-component.html',
    styleUrls: ['./reset-password-component.scss']
})

export class ResetPasswordComponent {
    submitted: boolean = false;
    resetPasswordForm: FormGroup;
    ngOnInit() {
        this.resetPasswordForm = new FormGroup({
            newPassword: new FormControl('', [Validators.required]),
            confirmNewPassword: new FormControl('', [Validators.required])
        });
    }

    submitResetPasswordForm() {
        this.submitted = true;
        if (this.resetPasswordForm.invalid) {
            return
        }
    }
}
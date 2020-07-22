import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiService } from "../../_services/api.service";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from "@angular/router";

@Component({
    selector: 'create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.scss']
})

export class CreateAccountComponent implements OnInit {

    submitted: boolean = false;
    createAccountForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(public _apiService: ApiService,
        private _snackBar: MatSnackBar,
        private _router: Router) {

    }
    ngOnInit() {
        this.generateCreateAccountForm();
    }

    generateCreateAccountForm() {
        this.createAccountForm = new FormGroup({
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)]),
            confirm_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        });
    }

    submitCreateAccountForm() {
        this.submitted = true;
        if (this.createAccountForm.invalid) {
            return;
        }
        if (this.createAccountForm.valid) {
            let payload = {};
            payload['firstName'] = this.createAccountForm.controls.first_name.value;
            payload['lastName'] = this.createAccountForm.controls.last_name.value;
            payload['emailAddress'] = this.createAccountForm.controls.email.value;
            payload['password'] = this.createAccountForm.controls.password.value;
            payload['subscribeValid'] = "2020-07-15 02:16:21.341";//new Date().toLocaleString().replace(/,+/g, '').slice(0, -3);
            this._apiService.createUser(payload).subscribe((data: any) => {
                this.openSnackBar(data.message, 'Dismiss');
                this.createAccountForm.reset();
                this._router.navigate(['user-auth/login']);
            });
        }
    }

    openSnackBar(message, action) {
        this._snackBar.open(message, action, {
            duration: 2000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
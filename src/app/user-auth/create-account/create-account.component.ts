import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";


@Component({
    selector: 'create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.scss']
})

export class CreateAccountComponent implements OnInit {

    submitted: boolean = false;
    createAccountForm: FormGroup;

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
    }
}
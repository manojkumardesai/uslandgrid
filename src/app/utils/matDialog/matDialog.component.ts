import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { LoginService } from 'src/app/_services/login.service';
import { FormGroup, FormControl } from '@angular/forms';

export interface DialogData {
    group: string;
    format: string;
    criteria: string;
    value: string;
}

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './matDialog.template.html',
})
export class FilterDialog implements OnInit {
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
    form: FormGroup = new FormGroup({
        group: new FormControl(''),
        format: new FormControl(''),
        criteria: new FormControl(''),
        value: new FormControl(''),
    });
    groups = [
        { value: 'County' },
        { value: 'Operator' }
    ];
    formats = [
        { value: 'CSV' },
        { value: 'XLSX' },
        { value: 'TXT' },
        { value: 'WB4' },
        { value: 'WB2' }
    ];
    criterias = [{
        value: 'CONTAINS'
    }];
    operators = [];
    counties = [];
    values = [];
    payLoad = {};
    isLoggedIn = false;

    constructor(
        public dialogRef: MatDialogRef<FilterDialog>, public apiService: ApiService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, public loginService: LoginService) { }

    ngOnInit() {
        this.dialogRef.updatePosition({ top: '7.8%', left: '50px' });

        if (Object.keys(this.data).length) {
            if (this.data.group == 'Operator') {
                this.fetchOperators();
            } else {
                this.fetchCounties();
            }
            this.setDefaultFormValues();
        }
        this.loginService.user.subscribe((data) => {
            this.isLoggedIn = data && data.loggedIn ? data.loggedIn : false;
        });
    }

    fetchOperators() {
        this.apiService.fetchOperators().subscribe((data) => {
            this.operators = data.operators;
            this.values = data.operators;
        })
    }

    fetchCounties() {
        this.apiService.fetchCounties().subscribe((data) => {
            this.counties = data;
            this.values = data;
        });
    }
    onNoClick(): void {
        this.form.setValue({
            group: '',
            format: '',
            criteria: '',
            value: '',
        })
        this.dialogRef.close();
    }

    setDefaultFormValues() {
        setTimeout(() => {
            this.form.setValue({
                group: this.data && this.data.group ? this.data.group : '',
                format: this.data && this.data.format ? this.data.format : '',
                criteria: this.data && this.data.criteria ? this.data.criteria : '',
                value: this.data && this.data.value ? this.data.value : '',
            });
        }, 1000)
    }
    type() {
        if (this.form.value.group == 'Operator') {
            this.fetchOperators();
        } else {
            this.fetchCounties();
        }
        this.payLoad['group'] = this.form.value.group.toLowerCase();
    }
    criteria() {
        this.payLoad['criteria'] = this.form.value.criteria.toLowerCase();
    }
    value() {
        this.payLoad['value'] = this.form.value.value.toLowerCase();
    }
    fileFormat() {
        this.payLoad['format'] = this.form.value.format.toLowerCase();
    }

    generateReport() {
        const url = this.apiService.generateReport(this.payLoad);
        const link = this.downloadZipLink.nativeElement;
        link.href = url
        link.click();
        window.URL.revokeObjectURL(url);
        this.dialogRef.close();
    }

}
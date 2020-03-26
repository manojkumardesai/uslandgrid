import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { LoginService } from 'src/app/_services/login.service';

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './matDialog.template.html',
})
export class FilterDialog implements OnInit {
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
    groups = [
        { value: 'County' },
        { value: 'Operator' }
    ];
    formats = [
        { value: 'CSV' },
        { value: 'XLSX' },
        { value: 'TXT' },
        { value: 'WB4' }
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
        this.apiService.fetchCounties().subscribe((data) => {
            this.counties = data;
        });
        this.apiService.fetchOperators().subscribe((data) => {
            this.operators = data;
        });
        this.loginService.user.subscribe((data) => {
            this.isLoggedIn = data.loggedIn;
        });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    type(option) {
        this.values = option.value == 'Operator' ? this.operators : this.counties;
        this.payLoad['group'] = String(option.value).toLowerCase();
    }
    criteria(option) {
        this.payLoad['criteria'] = String(option.value).toLowerCase();
    }
    value(option) {
        this.payLoad['value'] = String(option.value).toLowerCase();
    }
    fileFormat(option) {
        this.payLoad['format'] = String(option.value).toLowerCase();
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
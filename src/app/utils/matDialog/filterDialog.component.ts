import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { LoginService } from 'src/app/_services/login.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface DialogData {
    field: string;
    format: string;
    criteria: string;
    operator: string;
    value: string;
}

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './filterDialog.template.html',
    styleUrls: ['./filterDialog.component.scss']
})
export class FilterDialog implements OnInit {
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
    form: FormGroup;
    filterView = true;
    persist = false;
    fields = [
        { value: 'County' },
        { value: 'Operator' },
        { value: 'Frac Type' },
        { value: 'Frac Date' },
    ];
    formats = [
        { value: 'CSV' },
        { value: 'XLSX' },
        { value: 'TXT' },
        { value: 'WB4' },
        { value: 'WB2' }
    ];
    conditions = [
        { value: 'EQUALS' },
        { value: 'NOT EQUALS' },
        { value: 'GREATER THAN' },
        { value: 'GREATER THAN OR EQUAL' },
        { value: 'LESS THAN' },
        { value: 'LESS THAN OR EQUAL' },
        { value: 'BEGINS WITH' },
        { value: 'ENDS WITH' },
        { value: 'CONTAINS' },
        { value: 'DOES NOT CONTAIN' },
        { value: 'IS ON OR BEFORE' },
        { value: 'IS ON OR AFTER' }
    ];
    operators = ["AND", "OR"];
    counties = [];
    wellOperators = [];
    values = [];
    payLoad = {};
    isLoggedIn = false;
    downloadJsonHref: SafeUrl = '';

    constructor(
        public dialogRef: MatDialogRef<FilterDialog>, public apiService: ApiService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, public loginService: LoginService,
        public fb: FormBuilder, public sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.form = this.fb.group({
            reportType: '',
            wellsCriteria: this.fb.array([
                this.addFilterCriteriaFormGroup()
            ])
        });
        this.dialogRef.updatePosition({ top: '7.8%', left: '3%' });
        this.fetchCounties();
        this.fetchOperators();
        this.loginService.user.subscribe((data) => {
            this.isLoggedIn = data && data.loggedIn ? data.loggedIn : false;
        });
        if (Object.keys(this.data).length) {
            setTimeout(() => {
                this.setValues(this.data);
            }, 600);
        }
    }

    fetchOperators() {
        this.apiService.fetchOperators().subscribe((data) => {
            this.wellOperators = data.operators;
        })
    }

    fetchCounties() {
        this.apiService.fetchCounties().subscribe((data) => {
            this.counties = data;
        });
    }
    onNoClick(): void {
        if (!this.persist) {
            this.form.reset();
        }
        this.dialogRef.close(this.form.value);
    }

    setDefaultFormValues() {
        setTimeout(() => {
            this.form.setValue({
                field: this.data && this.data.field ? this.data.field : '',
                format: this.data && this.data.format ? this.data.format : '',
                criteria: this.data && this.data.criteria ? this.data.criteria : '',
                value: this.data && this.data.value ? this.data.value : '',
            });
        }, 1000)
    }
    type(i) {
        if (this.form.value["wellsCriteria"][i].field == 'Operator') {
            this.values[i] = this.wellOperators;
        } else {
            this.values[i] = this.counties;
        }
    }

    generateReport() {
        const url = this.apiService.generateReport(this.form.value);
        const link = this.downloadZipLink.nativeElement;
        link.href = url
        link.click();
        window.URL.revokeObjectURL(url);
        this.dialogRef.close();
    }

    addFilterCriteriaFormGroup(): FormGroup {
        return this.fb.group({
            field: new FormControl(''),
            value: new FormControl(''),
            condition: new FormControl(''),
            operator: new FormControl('')
        });
    }

    refreshData() {
        this.form.reset();
    }

    addCriteria() {
        (<FormArray>this.form.get('wellsCriteria')).push(this.addFilterCriteriaFormGroup());
    }

    get formData() {
        return <FormArray>this.form.get('wellsCriteria');
    }

    removeCriteria(wellsCriteriaIndex) {
        (<FormArray>this.form.get('wellsCriteria')).removeAt(wellsCriteriaIndex);
    }

    isConditionAdded(i) {
        return (i + 1) < this.formData.length && this.formData.length > 1
    }

    toggleView() {
        this.filterView = !this.filterView
    }

    saveFile() {
        var sJson = JSON.stringify(this.form.value);
        var element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
        element.setAttribute('download', "group-filter-options.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
    }

    log(event) {
        let reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(<string>e.target.result);
            this.setValues(data.wellsCriteria);
        }
        reader.readAsText(event.target.files[0]);
    }

    persistChanges(event) {
        this.persist = event.checked;
    }

    setValues(wellsCriteria) {
        for (let line = 1; line < wellsCriteria.length; line++) {
            const linesFormArray = this.form.get("wellsCriteria") as FormArray;
            linesFormArray.push(this.addFilterCriteriaFormGroup());
        }
        this.form.controls.wellsCriteria.patchValue(wellsCriteria);
        wellsCriteria.map((val, index) => {
            this.type(index);
        });
        this.form.controls.wellsCriteria.patchValue(wellsCriteria);
        this.filterView = true;
    }
}
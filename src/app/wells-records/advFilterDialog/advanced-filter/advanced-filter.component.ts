import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, Form, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { LoginService } from 'src/app/_services/login.service';
import { saveAs } from 'file-saver';
declare var $: any;

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss']
})
export class AdvancedFilterComponent implements OnInit {
  globalLogicalConditions = [
    { value: 'and', viewValue: 'Display features in the layer that match all of the following expressions' },
    { value: 'or', viewValue: 'Display features in the layer that match any of the following expressions' }
  ];
  setLogicalConditions = [
    { value: 'and', viewValue: 'All of the following expressions in this set are true' },
    { value: 'or', viewValue: 'Any of the following expressions in this set are true' }
  ];
  generatingReport = false;
  allEnabledConditions = ['is', 'is not',];
  valueEnabledConditions = ['starts with', 'ends with', 'contains', 'does not contain'];
  multipleValueConditions = ['is any of', 'is none of'];
  blankConditions = ['is blank', 'is not blank'];
  valuePlaceHolder = [];
  formats = [
    { value: 'SHP' },
    { value: 'WB2' },
    { value: 'WB4' },
    { value: 'CSV' },
    { value: 'XLSX' },
    { value: 'TXT' },
  ];
  reportType;

  valueTypes = ['Unique', 'Value', 'Multiple'];
  selectedGlobalCondition;
  selectedSetCondition;
  columns;
  prodColumns;
  conditions;
  dateConditions;
  integerConditions;
  stringConditions;
  values = [];
  valueTypeMap = [];
  arrayForValidation = [];
  fieldValues = [
    'wellid',
    'wellname',
    'operator',
    'wellnumber',
    'status',
    'latitude',
    'longitude',
    'spuddate',
    'completiondate',
    'datumtype',
    'tvd',
    'state',
    'county',
  ];
  isLoggedIn = false;
  titleMsg = 'Login to export';
  advanceFilterForm: FormGroup;
  filterForm: FormGroup;

  /* new filter codes starts from here*/
  panelOpenState: boolean = false;
  constructor(public dialogRef: MatDialogRef<AdvancedFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public fb: FormBuilder,
    public loginService: LoginService,
    public apiService: ApiService) { }

  ngOnInit(): void {

    this.populateColumns();
    this.conditions = [
      {
        "id": 0,
        "name": "is",
        "value": "is"
      },
      {
        "id": 1,
        "name": "is not",
        "value": "is not"
      },
      {
        "id": 2,
        "name": "start with",
        "value": "start with"
      },
      {
        "id": 3,
        "name": "end with",
        "value": "end with"
      },
      {
        "id": 4,
        "name": "contains",
        "value": "contains"
      },
      {
        "id": 5,
        "name": "does not contain",
        "value": "does not contain"
      },
      {
        "id": 6,
        "name": "is any of",
        "value": "is any of"
      },
      {
        "id": 7,
        "name": "is none of",
        "value": "is none of"
      },
      {
        "id": 8,
        "name": "is blank",
        "value": "is blank"
      },
      {
        "id": 9,
        "name": "is not blank",
        "value": "is not blank"
      }
    ];
    this.dateConditions = ['equal', 'before', 'after'];
    this.integerConditions = ['equal to', 'less than', 'less than or equal', 'greater than',
      'greater than or equal'];
    this.stringConditions = [
      "is",
      "is not",
      "start with",
      "end with",
      "contains",
      "does not contain",
      "is any of",
      "is none of",
      "is blank",
      "is not blank"
    ];
    this.selectedGlobalCondition = this.globalLogicalConditions[0].value;
    this.selectedSetCondition = this.setLogicalConditions[0].value;
    this.advanceFilterForm = this.fb.group({
      operator: this.selectedGlobalCondition,
      exp: this.fb.array([]),
      set: this.fb.array([])
    });
    if (this.data) {
      this.setDefaultFormValues();
    } else {
      this.addSetToSetForm();
    }
    this.loginService.user.subscribe((data) => {
      this.isLoggedIn = data && data.loggedIn ? data.loggedIn : false;
      if (this.isLoggedIn) {
        this.titleMsg = "Choose format to download report";
      } else {
        this.titleMsg = 'Login to export';
      }

    });
    this.filterFormMethod();
  }

  populateColumns() {
    this.apiService.fetchColumnValues(false).subscribe((columnValues: any) => {
      this.columns = [...columnValues];
    });
    this.apiService.fetchColumnValues(true).subscribe((columnValues: any) => {
      this.prodColumns = [...columnValues];
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  get expForms() {
    return this.advanceFilterForm.get('exp') as FormArray;
  }

  get setForms() {
    return this.advanceFilterForm.get('set') as FormArray;
  }

  filterFormMethod() {
    this.filterForm = new FormGroup({
      wells: new FormGroup({
        string: new FormGroup({
          option: new FormControl('option value'),
          condtions: new FormControl('is any of')
        })
      }),
      landGrid: new FormGroup({
        string: new FormGroup({
          option: new FormControl('option value'),
          condtions: new FormControl('is any of')
        })
      }),
      date: new FormGroup({
        string: new FormGroup({
          option: new FormControl('option value'),
          condtions: new FormControl('is any of')
        })
      })
    });
  }

  applyfil() {
    console.log(this.filterForm.value)
  }

  addExpressionToExp() {
    this.expForms.push(this.expressionStructure());
    this.valueTypeMap[this.expForms.length - 1] = "Unique";
  }

  addSetToSetForm() {
    const expTemp = this.fb.group({
      setOperator: '',
      exp: this.fb.array([])
    });
    expTemp.get('setOperator').setValue(this.setLogicalConditions[0].value);
    let expTempFormArray = expTemp.get('exp') as FormArray;
    expTempFormArray.push(this.expressionStructure());
    this.setForms.push(expTemp);
    this.valueTypeMap[this.setForms.length - 1 + '' + 0] = "Value";
    this.addExpToSetForm(this.setForms.length - 1);
  }

  addExpToSetForm(index) {
    let indexedExp = this.setForms.controls[index].get('exp') as FormArray;
    indexedExp.push(this.expressionStructure());
    this.valueTypeMap[index + '' + (indexedExp.length - 1)] = "Value";
  }

  deleteExpFromExpArray(expIndex) {
    this.expForms.removeAt(expIndex);
  }

  deleteSet(setIndex) {
    this.setForms.removeAt(setIndex);
  }

  deleteExpFromSet(expIndex, setIndex) {
    let indexedExp = this.getExpAtSetIndex(setIndex);
    indexedExp.removeAt(expIndex);
  }

  getExpAtSetIndex(setIndex) {
    return this.setForms.controls[setIndex].get('exp') as FormArray;
  }

  expressionStructure() {
    return this.fb.group({
      column: new FormControl(''),
      type: new FormControl('string', Validators.required),
      table: new FormControl('WH', Validators.required),
      condition: new FormControl('is', Validators.required),
      option: new FormControl('value', Validators.required),
      caseSensitive: false,
      value: new FormControl([], Validators.required)
    });
  }

  apply() {
    console.log(this.advanceFilterForm.value);
  }

  // Column dropdown change event handlers
  changeExpColumnValue(expIndex) {
    this.expForms.controls[expIndex].patchValue({
      value: [''],
      condition: 'is',
      caseSensitive: false,
      type: 'string'
    });
    this.valueTypeMap[expIndex] = "Unique";
  }

  changeSetExpColumnValue(setIndex, expIndex, event) {
    let indexedExp = this.getExpAtSetIndex(setIndex);
    indexedExp.controls[expIndex].patchValue({
      column: event.option.value.column,
      table: event.option.value.table,
      value: [''],
      condition: '',
      caseSensitive: false,
      type: event.option.value.type
    });
    this.valueTypeMap[setIndex + '' + expIndex] = "Unique";
    this.setConditionsBasedOncolumntype(setIndex, expIndex, event.option.value.type);
    this.setExpSettingMenuChange(setIndex, expIndex, 'Unique');
  }

  setConditionsBasedOncolumntype(setIndex, expIndex, columnType) {
    let indexedExp = this.getExpAtSetIndex(setIndex);
    if (columnType.toLowerCase() === 'date') {
      this.conditions[setIndex + '' + expIndex] = [...this.dateConditions];
      this.valuePlaceHolder[setIndex + '' + expIndex] = "Use YYYY-MM-DD format";
    } else if (columnType.toLowerCase() === 'integer') {
      this.conditions[setIndex + '' + expIndex] = [...this.integerConditions];
      this.valuePlaceHolder[setIndex + '' + expIndex] = "Enter filter term here";
    } else {
      this.conditions[setIndex + '' + expIndex] = [...this.stringConditions];
      this.valuePlaceHolder[setIndex + '' + expIndex] = "Enter filter term here";
    }
    indexedExp.controls[expIndex].patchValue({
      condition: this.conditions[setIndex + '' + expIndex][0]
    });
  }
  // End of column dropdown change event handlers

  // Condtion tab change event handlers
  expConditionChange(expIndex) {
    this.expForms.controls[expIndex].patchValue({
      value: ['']
    });
    this.valueTypeMap[expIndex] = "Unique";
  }

  setExpMenuValues(expIndex, value) {
    let condition = this.expForms.value[expIndex].condition;
    if (this.allEnabledConditions.includes(condition) && value !== 'Multiple') {
      return false;
    } else if (this.valueEnabledConditions.includes(condition) && value === 'Value') {
      return false;
    } else if (this.multipleValueConditions.includes(condition) && value === 'Multiple') {
      return false;
    } else if (this.blankConditions.includes(condition)) {
      return true;
    } else {
      return true;
    }
  }

  setExpConditionChange(setIndex, expIndex) {
    let indexedExp = this.getExpAtSetIndex(setIndex);
    indexedExp.controls[expIndex].patchValue({
      value: ['']
    });
    this.valueTypeMap[setIndex + '' + expIndex] = "Unique";
  }

  setMenuValuesOfSet(setIndex, expIndex, value) {
    let indexedExp = this.getExpAtSetIndex(setIndex);
    let condition = indexedExp.value[expIndex].condition;
    if ((this.allEnabledConditions.includes(condition) || this.dateConditions.includes(condition)
      || this.integerConditions.includes(condition) || this.stringConditions.includes(condition))
      && value !== 'Multiple') {
      return false;
    } if ((this.valueEnabledConditions.includes(condition) || this.dateConditions.includes(condition)
      || this.integerConditions.includes(condition) || this.stringConditions.includes(condition))
      && value === 'Value') {
      return false;
    } else if (this.multipleValueConditions.includes(condition) && value === 'Multiple') {
      return false;
    } else if (this.blankConditions.includes(condition)) {
      return true;
    } else {
      return true;
    }
  }
  // End of condition tab change event handlers

  // Settings button change event handlers
  setExpSettingMenuChange(setIndex, expIndex, value) {
    let indexedExp = this.getExpAtSetIndex(setIndex);
    indexedExp.controls[expIndex].patchValue({
      value: [''],
      option: value.toLocaleLowerCase()
    });
    let column = indexedExp.value[expIndex].column;
    let table = indexedExp.value[expIndex].table;
    if (value == 'Field') {
      this.values[setIndex + '' + expIndex] = this.fieldValues.map((data, index) => {
        return {
          id: index,
          name: data
        }
      });
    } else if (value == 'Unique' || value == 'Multiple') {
      this.apiService.fetchUniqueValues(column, table).subscribe((data: any) => {
        this.values[setIndex + '' + expIndex] = data.map((data, index) => {
          return {
            id: index,
            name: data
          }
        });
      });
    }
    this.valueTypeMap[setIndex + '' + expIndex] = value;
  }

  expSettingMenuChange(expIndex, value) {
    let column = this.expForms.value[expIndex].column;
    let table = this.expForms.value[expIndex].table;
    this.expForms.controls[expIndex].patchValue({
      value: [''],
      option: value.toLocaleLowerCase()
    });
    if (value == 'Field') {
      this.values[expIndex] = this.fieldValues.map((data, index) => {
        return {
          id: index,
          name: data
        }
      });
    } else if (value == 'Unique' || value == 'Multiple') {
      this.apiService.fetchUniqueValues(column, table).subscribe((data: any) => {
        this.values[expIndex] = data.map((data, index) => {
          return {
            id: index,
            name: data
          }
        });
      });
    }
    this.valueTypeMap[expIndex] = value;
  }

  setDefaultFormValues() {
    for (let i = 0; i < this.data.exp.length; i++) {
      this.addExpressionToExp();
    }
    for (let j = 0; j < this.data.set.length; j++) {
      this.addSetToSetForm();
    }
    for (let k = 0; k < this.data.set.length; k++) {
      for (let l = 2; l < this.data.set[k].exp.length; l++) {
        this.addExpToSetForm(k);
      }
    }
    this.arrayForValidation.length = this.advanceFilterForm.value.set.length;
    this.advanceFilterForm.setValue(this.data);
  }

  getValueFieldFormControl(expIndex) {
    return (this.expForms.controls[expIndex] as any).controls.value;
  }

  getValueFieldFormControlForSet(setIndex, expIndex) {
    return (this.getExpAtSetIndex(setIndex).controls[expIndex] as any).controls.value
  }

  updateInput(expIndex, event?) {
    let valueControl = (this.expForms.controls[expIndex] as any).controls.value;
    let userEnteredValue = [];
    if (event && event.value) {
      userEnteredValue.push(event.value);
    } else {
      userEnteredValue.push(valueControl.value);
    }
    valueControl.patchValue(userEnteredValue);
  }

  updateSetInput(setIndex, expIndex, event?) {
    let valueControl = this.getValueFieldFormControlForSet(setIndex, expIndex);
    let column = this.getExpAtSetIndex(setIndex).controls[expIndex].value.column;
    let userEnteredValue = [];
    if (column) {
      if (event && event.value) {
        userEnteredValue.push(event.value);
        this.arrayForValidation[setIndex] = event.value;
      } else if (valueControl.value) {
        userEnteredValue.push(valueControl.value);
        this.arrayForValidation[setIndex] = valueControl.value;
      } else if (event.target.value) {
        this.arrayForValidation[setIndex] = event.target.value;
      } else {
        this.arrayForValidation.splice(setIndex, 1);
      }
    }
    valueControl.patchValue(userEnteredValue);
  }

  get displayGlobalConditions() {
    return this.expForms.length > 1 || this.setForms.length > 1 ||
      (this.expForms.length > 0 && this.setForms.length > 0);
  }

  reset() {
    this.arrayForValidation = [];
    this.advanceFilterForm.reset();
  }

  get invalidForm() {
    return this.arrayForValidation.length != this.advanceFilterForm.value.set.length;
  }

  generateReport() {
    let payLoad = {};
    payLoad['reportType'] = this.reportType;
    payLoad['filters'] = this.advanceFilterForm.value;
    this.generatingReport = true;
    this.apiService.generateReport(payLoad).subscribe((data) => {
      const extension = this.reportType.toLowerCase() == 'shp' ? 'zip' : this.reportType.toLowerCase();
      const blobCont = new File([data], "Report." + extension, { type: extension });
      saveAs(blobCont);
      this.generatingReport = false;
    })
  }

  // Toggle plus minus icon on show hide of collapse element
  toggleCollapse() {
    $(".collapse").on('show.bs.collapse', function () {
      $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function () {
      $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });
  }

}

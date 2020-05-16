import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, Form } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';


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
  allEnabledConditions = ['is', 'is not'];
  valueEnabledConditions = ['starts with', 'ends with', 'contains', 'does not contain'];
  multipleValueConditions = ['is any of', 'is none of'];
  blankConditions = ['is blank', 'is not blank'];

  valueTypes = ['Value', 'Field', 'Unique', 'Multiple'];
  selectedGlobalCondition;
  selectedSetCondition;
  columns;
  conditions;
  values = [];
  valueTypeMap = [];
  fieldValues = [
    'county',
    'operator',
    'api_number',
    'well_name',
    'tvd',
    'frac_type',
    'datum',
    'link_efrac',
  ];
  advanceFilterForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AdvancedFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public fb: FormBuilder,
    public apiService: ApiService) { }

  ngOnInit(): void {

    this.columns = [
      {
        'id': 0,
        'name': 'state (String)',
        'value': 'state'
      },
      {
        'id': 1,
        'name': 'county (String)',
        'value': 'county'
      },
      {
        'id': 2,
        'name': 'operator (String)',
        'value': 'operator'
      },
      {
        'id': 3,
        'name': 'well_id (String)',
        'value': 'well_id'
      },
      {
        'id': 4,
        'name': 'well_name (String)',
        'value': 'well_name'
      },
      {
        'id': 5,
        'name': 'objectid (Number)',
        'value': 'objectid'
      },
      {
        'id': 6,
        'name': 'tvd (String)',
        'value': 'tvd'
      },
      {
        'id': 7,
        'name': 'frac_type (String)',
        'value': 'frac_type'
      },
      {
        'id': 8,
        'name': 'start_date (Date)',
        'value': 'start_date'
      },
      {
        'id': 9,
        'name': 'longitude (Number)',
        'value': 'longitude'
      },
      {
        'id': 10,
        'name': 'latitude (Number)',
        'value': 'latitude'
      },
      {
        'id': 11,
        'name': 'datum (String)',
        'value': 'datum'
      },
      {
        'id': 12,
        'name': 'link_efrac (String)',
        'value': 'link_efrac'
      }
    ];
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
    this.selectedGlobalCondition = this.globalLogicalConditions[0].value;
    this.selectedSetCondition = this.setLogicalConditions[0].value;
    this.advanceFilterForm = this.fb.group({
      operator: this.selectedGlobalCondition,
      exp: this.fb.array([]),
      set: this.fb.array([])
    });
    if (this.data) {
      this.setDefaultFormValues();
    }
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

  addExpressionToExp() {
    this.expForms.push(this.expressionStructure());
    this.valueTypeMap[this.expForms.length - 1] = "Value";
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
      column: 'state',
      type: 'string',
      condition: 'is',
      caseSensitive: false,
      value: ['']
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
    this.valueTypeMap[expIndex] = "Value";
  }

  changeSetExpColumnValue(setIndex, expIndex) {
    let indexedExp = this.getExpAtSetIndex(setIndex);
    indexedExp.controls[expIndex].patchValue({
      value: [''],
      condition: 'is',
      caseSensitive: false,
      type: 'string'
    });
    this.valueTypeMap[setIndex + '' + expIndex] = "Value";
  }
  // End of column dropdown change event handlers

  // Condtion tab change event handlers
  expConditionChange(expIndex) {
    this.expForms.controls[expIndex].patchValue({
      value: ['']
    });
    this.valueTypeMap[expIndex] = "Value";
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
    this.valueTypeMap[setIndex + '' + expIndex] = "Value";
  }

  setMenuValuesOfSet(setIndex, expIndex, value) {
    let indexedExp = this.getExpAtSetIndex(setIndex);
    let condition = indexedExp.value[expIndex].condition;
    if (this.allEnabledConditions.includes(condition) && value !== 'Multiple') {
      return false;
    } if (this.valueEnabledConditions.includes(condition) && value === 'Value') {
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
      value: ['']
    });
    let column = indexedExp.value[expIndex].column;
    if (value == 'Field') {
      this.values[setIndex + '' + expIndex] = this.fieldValues.map((data, index) => {
        return {
          id: index,
          name: data
        }
      });
    } else if (value == 'Unique') {
      this.apiService.fetchUniqueValues(column).subscribe((data: any) => {
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
    this.expForms.controls[expIndex].patchValue({
      value: ['']
    });
    if (value == 'Field') {
      this.values[expIndex] = this.fieldValues.map((data, index) => {
        return {
          id: index,
          name: data
        }
      });
    } else if (value == 'Unique') {
      this.apiService.fetchUniqueValues(column).subscribe((data: any) => {
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

    this.advanceFilterForm.setValue(this.data);
  }

  getValueFieldFormControl(expIndex) {
    return (this.expForms.controls[expIndex] as any).controls.value;
  }

  getValueFieldFormControlForSet(setIndex, expIndex) {
    return (this.getExpAtSetIndex(setIndex).controls[expIndex] as any).controls.value
  }
}

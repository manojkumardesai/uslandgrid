import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, Form } from '@angular/forms';


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
  selectedGlobalCondition;
  selectedSetCondition;
  columns;
  conditions;
  values = [];
  advanceFilterForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AdvancedFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public fb: FormBuilder) { }

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
      exp: this.fb.array([

      ]),
      set: this.fb.array([

      ])
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


  addExpressionToExp() {
    this.expForms.push(this.expressionStructure());
  }

  addSetToSetForm() {
    const expTemp = this.fb.group({
      setOperator: '',
      exp: this.fb.array([])
    });
    let expTempFormArray = expTemp.get('exp') as FormArray;
    expTempFormArray.push(this.expressionStructure());
    this.setForms.push(expTemp);
    this.addExpToSetForm(this.setForms.length - 1);
  }

  addExpToSetForm(index) {
    let indexedExp = this.setForms.controls[index].get('exp') as FormArray;
    indexedExp.push(this.expressionStructure());
  }

  deleteExpFromExpArray(expIndex) {
    this.expForms.removeAt(expIndex);
  }

  deleteSet(setIndex) {
    this.setForms.removeAt(setIndex);
  }

  deleteExpFromSet(expIndex, setIndex) {
    let indexedExp = this.setForms.controls[setIndex].get('exp') as FormArray;
    indexedExp.removeAt(expIndex);
  }

  expressionStructure() {
    return this.fb.group({
      column: '',
      type: '',
      condition: '',
      caseSensitive: false,
      value: []
    });
  }
}

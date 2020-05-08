import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

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
  selected;
  columns;
  advanceFilterForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AdvancedFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.columns = [
      [
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
      ]
    ]
    this.selected = this.globalLogicalConditions[0].value;
    this.advanceFilterForm = this.fb.group({
      operator: this.selected,
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
    const exp = this.fb.group({
      column: '',
      type: '',
      condition: '',
      caseSensitive: false,
      value: []
    });
    this.expForms.push(exp);
  }

  addSetToSetForm() {
    const exp = this.fb.group({
      setOperator: '',
      exp: [{
        column: '',
        type: '',
        condition: '',
        caseSensitive: false,
        value: []
      }]
    });
    this.setForms.push(exp);
    this.addExpToSetForm(this.setForms.length - 1);
  }

  addExpToSetForm(index) {
    const exp = this.fb.group({
      column: '',
      type: '',
      condition: '',
      caseSensitive: false,
      value: []
    });
    this.setForms[index]['exp'].push(exp);
  }

  deleteExpFromExpArray(expIndex) {
    this.expForms.removeAt(expIndex);
  }

  deleteSet(setIndex) {
    this.setForms.removeAt(setIndex);
  }

  deleteExpFromSet(expIndex, setIndex) {
    this.setForms[setIndex]['exp'].removeAt(expIndex);
  }
}

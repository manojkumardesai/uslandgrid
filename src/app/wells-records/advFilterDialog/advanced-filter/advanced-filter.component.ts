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
  advanceFilterForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AdvancedFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public fb: FormBuilder) { }

  ngOnInit(): void {
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

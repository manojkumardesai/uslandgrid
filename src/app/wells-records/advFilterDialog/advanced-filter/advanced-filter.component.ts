import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  constructor(public dialogRef: MatDialogRef<AdvancedFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data, ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss']
})
export class AdvancedFilterComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AdvancedFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data, ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

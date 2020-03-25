import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

export interface DialogData {
    animal: string;
    name: string;
  }

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './matDialog.template.html',
  })
  export class FilterDialog {
    foods = [
        {value: 'steak-0', viewValue: 'Steak'},
        {value: 'pizza-1', viewValue: 'Pizza'},
        {value: 'tacos-2', viewValue: 'Tacos'}
      ];
    constructor(
      public dialogRef: MatDialogRef<FilterDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    type(option){
        console.log(option);
    }
    criteria(option){
        console.log(option);
    }
    value(option){
        console.log(option);
    }
  
  }
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/utils/matDialog/filterDialog.component';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<InfoWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, ) { }

  ngOnInit(): void {
    this.changePosition();
  }

  changePosition() {
    this.dialogRef.updatePosition({ right: '15px', bottom: '290px' });
  }

}

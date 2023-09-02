import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  result: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject(MAT_DIALOG_DATA) public userSelectedRoles: any
  ) { }

  ngOnInit(): void {
  }

  onConfirm() {
    this.result = !this.result;
    this.dialogRef.close({ data: this.result });
  }

  onCancel() {
    this.dialogRef.close({ data: this.result });
  }

}

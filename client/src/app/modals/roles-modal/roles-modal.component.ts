import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/_models/user';


@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {

  username = '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<RolesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject(MAT_DIALOG_DATA) public userSelectedRoles: any
  ) { }

  ngOnInit(): void {
    this.availableRoles = this.data.roles;
    this.selectedRoles  = this.data.selectedRoles;
    this.username = this.data.username; 
  }

  onNoClick(): void {
    this.dialogRef.close({data:this.data});
  }

  updateChecked(checkedValue: any) {
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue);
  }

  onCancel(): void {
    this.dialogRef.close({event:'cancel'});
  }

}

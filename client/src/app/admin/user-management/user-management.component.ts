import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  availableRoles = [
    'Admin',
    'Moderator',
    'Member'
  ]

  constructor(private adminService: AdminService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
      next: users => {
        this.users = users;
      }
    })
  }

  openDialog(user: User): void {
    const dialogRef = this.dialog.open(RolesModalComponent, {
      // height: '400px',
      width: '400px',
      disableClose: true,
      data: { roles: this.availableRoles, username: user.username, selectedRoles: [...user.roles] },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event === 'cancel') return;
      const selectedRoles = result.data.selectedRoles;
      console.log(selectedRoles)
      if (!this.arrayEqual(selectedRoles, user.roles)) {
        this.adminService.updateUserRoles(user.username, selectedRoles.join(',')).subscribe({
          next: roles => user.roles = roles
        })
      }
    });
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}

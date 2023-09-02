import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  dialog = inject(MatDialog);

  constructor() { }

  confirm(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      // height: '400px',
      width: '400px',
      disableClose: true,
    });

    return dialogRef.afterClosed().pipe(
      map((result) => {
        return result.data;
      })
    );
  }

}

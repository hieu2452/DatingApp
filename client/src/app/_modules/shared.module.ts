import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTabsModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
    FileUploadModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule, NgxPaginationModule,
    NgxSpinnerModule.forRoot({
      type: 'ball-spin-clockwise'
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      easing: 'easing',
      tapToDismiss: true
    }),
  ],
  exports:
    [ToastrModule,
      MatTabsModule,
      NgxGalleryModule,
      MatProgressSpinnerModule,
      NgxSpinnerModule,
      FileUploadModule,
      MatDatepickerModule,
      MatInputModule,
      NgxPaginationModule]
})
export class SharedModule { }

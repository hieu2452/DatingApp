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
import { MatRadioModule } from '@angular/material/radio';
import { TimeagoFormatter, TimeagoModule } from "ngx-timeago";
import { TimeAgoFormatter } from '../_pipes/TimeAgoFormatter';

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
    MatRadioModule,
    MatInputModule, NgxPaginationModule,
    NgxSpinnerModule.forRoot({
      type: 'ball-spin-clockwise'
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      easing: 'easing',
      tapToDismiss: true
    }),
    TimeagoModule.forRoot({
      formatter: { provide: TimeagoFormatter, useClass: TimeAgoFormatter },
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
      NgxPaginationModule,
      MatRadioModule, TimeagoModule]
})
export class SharedModule { }

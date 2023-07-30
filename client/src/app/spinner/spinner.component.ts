import { Component } from '@angular/core';
import { BusyService } from '../_services/busy.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  constructor(public loader: BusyService) {

  }
}

import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-radiology',
  templateUrl: './radiology.component.html',
  styleUrls: ['./radiology.component.scss'],
})
export class RadiologyComponent {
  dropToggle() {
    $('.drop').fadeToggle();
  }
}

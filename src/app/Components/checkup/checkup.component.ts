import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-checkup',
  templateUrl: './checkup.component.html',
  styleUrls: ['./checkup.component.scss'],
})
export class CheckupComponent {
  dropToggle() {
    $('.drop').fadeToggle();
  }
}

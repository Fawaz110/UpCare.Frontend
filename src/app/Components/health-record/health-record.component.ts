import { Component } from '@angular/core';

@Component({
  selector: 'app-health-record',
  templateUrl: './health-record.component.html',
  styleUrls: ['./health-record.component.scss']
})
export class HealthRecordComponent {
  chartOptions = {
    title: {
      text: "Heart Sensor 'MAX30100'"
    },
    animationDuration: 2000,
    data: [{
      type: "splineArea",
      dataPoints: [
        { label: "Apple", y: 10 },
        { label: "Orange", y: 15 },
        { label: "Banana", y: 25 },
        { label: "Mango", y: 30 },
        { label: "Grape", y: 28 }
      ]
    }]
  };
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeChartComponent } from './time-chart.component';

@NgModule({
  declarations: [TimeChartComponent],
  imports: [
    CommonModule
  ],
  exports: [
    TimeChartComponent
  ]
})
export class TimeChartModule { }

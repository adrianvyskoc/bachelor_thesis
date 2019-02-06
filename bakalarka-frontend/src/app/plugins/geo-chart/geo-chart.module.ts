import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoChartComponent } from './geo-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GeoChartComponent
  ],
  declarations: [GeoChartComponent]
})
export class GeoChartModule { }

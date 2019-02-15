import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionsComponent } from './admissions.component';
import { AdmissionsRoutingModule } from './admissions-routing.module';
import { AdmissionsBachelorComponent } from './admissions-bachelor/admissions-bachelor.component';
import { AdmissionsMasterComponent } from './admissions-master/admissions-master.component';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule, MatInputModule, MatIconModule } from '@angular/material';
import { AdmissionComponent } from './admission/admission.component';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/plugins/chart/chart.module';
import { GeoChartModule } from 'src/app/plugins/geo-chart/geo-chart.module';
import { MapModule } from 'src/app/plugins/map/map.module';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,

    ChartModule,
    GeoChartModule,
    MapModule,
    CommonModule,
    FormsModule,
    AdmissionsRoutingModule
  ],
  declarations: [
    AdmissionsComponent,
    AdmissionsBachelorComponent,
    AdmissionsMasterComponent,
    AdmissionComponent
  ]
})
export class AdmissionsModule { }

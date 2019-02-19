import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionsComponent } from './admissions.component';
import { AdmissionsRoutingModule } from './admissions-routing.module';
import { AdmissionsBachelorComponent } from './admissions-bachelor/admissions-bachelor.component';
import { AdmissionsMasterComponent } from './admissions-master/admissions-master.component';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule, MatInputModule, MatIconModule } from '@angular/material';
import { AdmissionComponent } from './admission/admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/plugins/chart/chart.module';
import { GeoChartModule } from 'src/app/plugins/geo-chart/geo-chart.module';
import { MapModule } from 'src/app/plugins/map/map.module';
import { AdmissionsComparisonComponent } from './admissions-comparison/admissions-comparison.component';
import { AdmissionsYearBlockComponent } from './admissions-comparison/admissions-year-block/admissions-year-block.component';

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
    ReactiveFormsModule,
    AdmissionsRoutingModule
  ],
  declarations: [
    AdmissionsComponent,
    AdmissionsBachelorComponent,
    AdmissionsMasterComponent,
    AdmissionComponent,
    AdmissionsComparisonComponent,
    AdmissionsYearBlockComponent
  ]
})
export class AdmissionsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionsComponent } from './admissions.component';
import { AdmissionsRoutingModule } from './admissions-routing.module';
import { AdmissionsBachelorComponent } from './admissions-bachelor/admissions-bachelor.component';
import { AdmissionsMasterComponent } from './admissions-master/admissions-master.component';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { AdmissionComponent } from './admission/admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/plugins/chart/chart.module';
import { GeoChartModule } from 'src/app/plugins/geo-chart/geo-chart.module';
import { MapModule } from 'src/app/plugins/map/map.module';
import { AdmissionsComparisonComponent } from './admissions-comparison/admissions-comparison.component';
import { StatisticsTableComponent } from './admissions-bachelor/statistics-table/statistics-table.component';
import { TimeChartModule } from 'src/app/plugins/time-chart/time-chart.module';
import { AdmissionsManagementComponent } from './admissions-management/admissions-management.component';
import { SchoolsOverviewComponent } from './components/schools-overview/schools-overview.component';
import { StudentsOriginComponent } from './components/students-origin/students-origin.component';
import { AbroadStudentsComponent } from './components/abroad-students/abroad-students.component';
import { RegionsComponent } from './components/regions/regions.component';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    ChartModule,
    TimeChartModule,
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
    AdmissionsManagementComponent,
    StatisticsTableComponent,
    SchoolsOverviewComponent,
    StudentsOriginComponent,
    AbroadStudentsComponent,
    RegionsComponent
  ]
})
export class AdmissionsModule { }

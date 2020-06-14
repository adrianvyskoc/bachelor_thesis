import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionsComponent } from './admissions.component';
import { AdmissionsRoutingModule } from './admissions-routing.module';
import { AdmissionsBachelorComponent } from './admissions-bachelor/admissions-bachelor.component';
import { AdmissionsMasterComponent } from './admissions-master/admissions-master.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdmissionComponent } from './admission/admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/plugins/chart/chart.module';
import { GeoChartModule } from 'src/app/plugins/geo-chart/geo-chart.module';
import { MapModule } from 'src/app/plugins/map/map.module';
import { AdmissionsComparisonComponent } from './admissions-comparison/admissions-comparison.component';
import { StatisticsTableComponent } from './admissions-bachelor/components/statistics/statistics-table/statistics-table.component';
import { TimeChartModule } from 'src/app/plugins/time-chart/time-chart.module';
import { AdmissionsManagementComponent } from './admissions-management/admissions-management.component';
import { SchoolsOverviewComponent } from './components/schools-overview/schools-overview.component';
import { StudentsOriginComponent } from './components/students-origin/students-origin.component';
import { AbroadStudentsComponent } from './components/abroad-students/abroad-students.component';
import { RegionsComponent } from './components/regions/regions.component';
import { HighSchoolInfoComponent } from './admission/components/high-school-info/high-school-info.component';
import { OtherAdmissionsComponent } from './admission/components/other-admissions/other-admissions.component';
import { GeneralInfoComponent } from './admission/components/general-info/general-info.component';
import { OtherUniversitiesInfoComponent } from './admissions-master/components/other-universities-info/other-universities-info.component';
import { StatisticsChartsComponent } from './admissions-master/components/statistics-charts/statistics-charts.component';
import { StatisticsComponent } from './admissions-bachelor/components/statistics/statistics.component';
import { SchoolsLeaderboardComponent } from './admissions-bachelor/components/schools-leaderboard/schools-leaderboard.component';
import { StatisticsPerYearsComponent } from './admissions-comparison/components/statistics-per-years/statistics-per-years.component';

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
    RegionsComponent,
    HighSchoolInfoComponent,
    OtherAdmissionsComponent,
    GeneralInfoComponent,
    OtherUniversitiesInfoComponent,
    StatisticsChartsComponent,
    StatisticsComponent,
    SchoolsLeaderboardComponent,
    StatisticsPerYearsComponent
  ]
})
export class AdmissionsModule { }

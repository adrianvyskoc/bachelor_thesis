import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionsComponent } from './admissions.component';
import { AdmissionsRoutingModule } from './admissions-routing.module';
import { AdmissionsBachelorComponent } from './admissions-bachelor/admissions-bachelor.component';
import { AdmissionsMasterComponent } from './admissions-master/admissions-master.component';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule, MatInputModule, MatIconModule } from '@angular/material';
import { AdmissionComponent } from './admission/admission.component';
import { ChartModule } from '../plugins/chart/chart.module';
import { FormsModule } from '@angular/forms';
import { MapModule } from '../plugins/map/map.module';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,

    ChartModule,
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionsComponent } from './admissions.component';
import { AdmissionsBachelorComponent } from './admissions-bachelor/admissions-bachelor.component';
import { AdmissionsMasterComponent } from './admissions-master/admissions-master.component';
import { AdmissionComponent } from './admission/admission.component';
import { AdmissionsComparisonComponent } from './admissions-comparison/admissions-comparison.component';
import { AdmissionsManagementComponent } from './admissions-management/admissions-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdmissionsComponent
  },
  {
    path: 'bachelor',
    component: AdmissionsBachelorComponent,
  },
  {
    path: 'master',
    component: AdmissionsMasterComponent,
  },
  {
    path: 'comparison',
    component: AdmissionsComparisonComponent,
  },
  {
    path: 'bachelor/:id',
    component: AdmissionComponent,
  },
  {
    path: 'master/:id',
    component: AdmissionComponent
  },
  {
    path: 'management',
    component: AdmissionsManagementComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AdmissionsRoutingModule { }

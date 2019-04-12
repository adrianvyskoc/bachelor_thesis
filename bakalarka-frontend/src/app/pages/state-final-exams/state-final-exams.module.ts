import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateFinalExamsComponent } from './components/state-final-exams/state-final-exams.component';
import { StateFinalExamsListComponent } from './components/state-final-exams-list/state-final-exams-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: StateFinalExamsComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    StateFinalExamsComponent, 
    StateFinalExamsListComponent,
  ],
  bootstrap: [
    StateFinalExamsComponent,
  ]
})
export class StateFinalExamsModule { }

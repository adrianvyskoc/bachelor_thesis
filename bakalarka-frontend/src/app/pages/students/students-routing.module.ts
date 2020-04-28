import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students.component';
import { StudentComponent } from './student/student.component';
import { DemoComponent } from './demo/demo.component';
import { PredictionComponent } from './prediction/prediction.component';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent
  },
  {
    path: 'demo',
    component: DemoComponent
  },
  {
    path: 'prediction',
    component: PredictionComponent
  },
  {
    path: ':id',
    component: StudentComponent
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
export class StudentsRoutingModule { }

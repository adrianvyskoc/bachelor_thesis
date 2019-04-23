import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateFinalExamsBcComponent } from './components/state-final-exams-bc/state-final-exams-bc.component';
import { StateFinalExamsListBcComponent } from './components/state-final-exams-list-bc/state-final-exams-list-bc.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { FormatNameTitlePipe } from 'src/app/pipes/format-name-title.pipe';
import { FormatLastnamePipe } from 'src/app/pipes/format-lastname.pipe';
import { FormatStudyProgrammePipe } from 'src/app/pipes/format-study-programme.pipe';
import { StateFinalExamsIngComponent } from './components/state-final-exams-ing/state-final-exams-ing.component';
import { StateFinalExamsListIngComponent } from './components/state-final-exams-list-ing/state-final-exams-list-ing.component';

const routes: Routes = [
  {
    path: '',
    component: StateFinalExamsBcComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    StateFinalExamsBcComponent, 
    StateFinalExamsListBcComponent,
    FormatNameTitlePipe,
    FormatLastnamePipe,
    FormatStudyProgrammePipe,
    StateFinalExamsIngComponent,
    StateFinalExamsListIngComponent
  ],
  bootstrap: [
    StateFinalExamsBcComponent,
  ]
})
export class StateFinalExamsModule { }

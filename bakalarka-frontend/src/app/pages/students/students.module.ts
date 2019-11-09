import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { StudentComponent } from './student/student.component';
import { StudentsRoutingModule } from './students-routing.module';

import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material';


@NgModule({
  declarations: [StudentsComponent, StudentComponent],
  imports: [
    MatExpansionModule,
    MatTabsModule,

    CommonModule,
    StudentsRoutingModule
  ]
})
export class StudentsModule { }

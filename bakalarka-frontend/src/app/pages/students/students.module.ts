import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { StudentComponent } from './student/student.component';
import { StudentsRoutingModule } from './students-routing.module';

import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule, MatButtonModule, MatTableModule } from '@angular/material';
import { DemoComponent } from './demo/demo.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [StudentsComponent, StudentComponent, DemoComponent],
  imports: [
    MatExpansionModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,

    CommonModule,
    StudentsRoutingModule,
    FormsModule
  ]
})
export class StudentsModule { }

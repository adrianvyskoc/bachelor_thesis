import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { StudentComponent } from './student/student.component';
import { StudentsRoutingModule } from './students-routing.module';

import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule, MatButtonModule, MatTableModule, MatInputModule, MatSelectModule } from '@angular/material';
import { DemoComponent } from './demo/demo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PredictionComponent } from './prediction/prediction.component';


@NgModule({
  declarations: [StudentsComponent, StudentComponent, DemoComponent, PredictionComponent],
  imports: [
    MatExpansionModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,

    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StudentsModule { }

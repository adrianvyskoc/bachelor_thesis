import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { StudentComponent } from './student/student.component';
import { StudentsRoutingModule } from './students-routing.module';

import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule, MatButtonModule, MatTableModule, MatDialogModule } from '@angular/material';
import { DemoComponent } from './demo/demo.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DiplomaDialogComponent } from './diploma-dialog/diploma-dialog.component';


@NgModule({
  declarations: [StudentsComponent, StudentComponent, DemoComponent, DiplomaDialogComponent],
  entryComponents: [DiplomaDialogComponent],
  imports: [
    MatExpansionModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,

    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    MatCheckboxModule
  ]
})
export class StudentsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { StudentComponent } from './student/student.component';
import { StudentsRoutingModule } from './students-routing.module';

import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule, MatButtonModule, MatTableModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatCheckboxModule, MatFormFieldModule } from '@angular/material';
import { DemoComponent } from './demo/demo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PredictionComponent } from './prediction/prediction.component';
import { ModelImportComponent } from './prediction/model-import/model-import.component';
import { HttpClientModule } from '@angular/common/http';
import { ModelCreateComponent } from './prediction/model-create/model-create.component'


@NgModule({
  declarations: [StudentsComponent, StudentComponent, DemoComponent, PredictionComponent, ModelImportComponent, ModelCreateComponent],
  imports: [
    MatExpansionModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    
    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class StudentsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { StudentComponent } from './student/student.component';
import { StudentsRoutingModule } from './students-routing.module';

import {MatExpansionModule} from '@angular/material/expansion';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PredictionComponent } from './prediction/prediction.component';
import { ModelImportComponent } from './prediction/model-import/model-import.component';
import { HttpClientModule } from '@angular/common/http';
import { ModelCreateComponent } from './prediction/model-create/model-create.component'
import { ChartModule } from 'src/app/plugins/chart/chart.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DemoComponent } from './demo/demo.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DiplomaDialogComponent } from './diploma-dialog/diploma-dialog.component';
import { ListDiplomasDialogComponent } from './listDiplomas-dialog/listDiplomas-dialog.component';

@NgModule({
  declarations: [StudentsComponent, StudentComponent, DemoComponent, PredictionComponent, ModelImportComponent, ModelCreateComponent, DiplomaDialogComponent, ListDiplomasDialogComponent],
  entryComponents: [DiplomaDialogComponent, ListDiplomasDialogComponent],

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
    MatDividerModule,
    
    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,

    ChartModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    MatCheckboxModule

  ]
})
export class StudentsModule { }

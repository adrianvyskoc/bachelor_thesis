import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportComponent } from './import.component';

import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatButtonModule,
  MatRadioModule,
  MatListModule,
  MatTabsModule,
  MatSidenavModule,
  MatDividerModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
} from "@angular/material";
import { ImportRoutingModule } from './import-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MappingDialogComponent } from './mapping-dialog/mapping-dialog.component';

@NgModule({
  imports: [
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatRadioModule,
    MatListModule,
    MatTabsModule,
    MatSidenavModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImportRoutingModule
  ],
  declarations: [
    ImportComponent,
    MappingDialogComponent,
  ],
  entryComponents: [
    MappingDialogComponent
  ]
})
export class ImportModule { }

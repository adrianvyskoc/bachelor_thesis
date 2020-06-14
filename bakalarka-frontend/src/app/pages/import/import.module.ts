import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportComponent } from './import.component';

import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
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

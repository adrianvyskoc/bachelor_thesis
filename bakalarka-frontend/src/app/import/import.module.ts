import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportComponent } from './import.component';
import { DataTablesComponent } from './data-tables/data-tables.component';

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
} from "@angular/material";
import { ImportRoutingModule } from './import-routing.module';
import { FormsModule } from '@angular/forms';

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

    CommonModule,
    FormsModule,
    ImportRoutingModule
  ],
  declarations: [
    ImportComponent,
    DataTablesComponent
  ]
})
export class ImportModule { }

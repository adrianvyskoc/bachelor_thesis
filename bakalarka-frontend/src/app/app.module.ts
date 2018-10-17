import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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


import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { DataTablesComponent } from './data-tables/data-tables.component';

@NgModule({
  declarations: [
    AppComponent,
    DataTablesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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

    HttpClientModule,
    FormsModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

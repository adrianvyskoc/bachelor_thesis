import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodebookTableComponent } from './codebook-table.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,

    CommonModule,
    FormsModule
  ],
  exports: [
    CodebookTableComponent
  ],
  declarations: [
    CodebookTableComponent
  ]
})
export class CodebookTableModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CodebookTableModule } from '../plugins/codebook-table/codebook-table.module';

@NgModule({
  imports: [
    MatButtonModule,

    CommonModule,
    FormsModule,
    SettingsRoutingModule,
    CodebookTableModule
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }

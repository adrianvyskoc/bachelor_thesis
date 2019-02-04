import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';

import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    FormsModule
  ],
  exports: [
    MapComponent
  ],
  declarations: [MapComponent]
})
export class MapModule { }

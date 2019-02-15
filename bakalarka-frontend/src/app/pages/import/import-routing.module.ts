import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportComponent } from './import.component';

const importRoutes: Routes = [
  {
    path: '',
    component: ImportComponent,
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(importRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class ImportRoutingModule { }

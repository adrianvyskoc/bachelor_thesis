import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    
  ],
  declarations: [
    StatisticsComponent,
  ]
})
export class StatisticsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { StatisticsListComponent } from './components/statistics-list/statistics-list.component';

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
    RouterModule.forChild(routes),
    
  ],
  declarations: [
    StatisticsComponent,
    StatisticsListComponent
  ]
})
export class StatisticsModule { }

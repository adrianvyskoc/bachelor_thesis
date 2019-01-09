import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent
  ],
  imports: [
    RouterModule,    
    CommonModule,
  ],
  exports: [
    HeaderComponent,
    SidenavComponent
  ]
})
export class CoreModule { }

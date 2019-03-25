import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './components/accounts/accounts.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AccountsFormComponent } from './components/accounts-form/accounts-form.component';
import { AccountsListComponent } from './components/accounts-list/accounts-list.component';
import { AccountsItemComponent } from './components/accounts-item/accounts-item.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    AccountsComponent,
    AccountsFormComponent,
    AccountsListComponent,
    AccountsItemComponent,
  ],
  bootstrap: [
    AccountsComponent,
  ]
})
export class AccountsModule { }

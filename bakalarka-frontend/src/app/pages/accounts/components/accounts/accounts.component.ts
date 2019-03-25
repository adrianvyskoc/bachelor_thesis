import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: any = []

  constructor(
    private accountsService: AccountsService
  ) { }

  ngOnInit() {
    this.getAllAccounts();
  }

  getAllAccounts() {
    this.accountsService.getAllAccounts()
    .subscribe(data => {
      this.accounts = data
    }, err => {
      console.log(err)
    })
  }

  // TODO
  onFormSubmitNotify(user: any) {
    this.accountsService.addAccount(user)
    .subscribe(data => {
      this.getAllAccounts()
    }, error => {
      console.log(error)
    })
  }

  // TODO
  onRemoveClickNotify(accountName: string) {
    this.accountsService.removeAccount(accountName)
    .subscribe(data => {
      this.getAllAccounts()
    }, error => {
      console.log(error)
    })
  }

}

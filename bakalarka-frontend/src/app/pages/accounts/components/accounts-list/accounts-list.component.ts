import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit, OnChanges {
  accounts: any[]
  dataSource: MatTableDataSource<any>
  displayedColumns: string[] = ['order', 'name', 'userAccess', 'adminAccess', 'actions']

  constructor(
    private accountsService: AccountsService
  ) { }

  ngOnInit() {
    this.accountsService.accounts.subscribe(data => {this.accounts = data;
      this.dataSource = new MatTableDataSource(this.accounts);
    });
    this.accountsService.loadAllAccounts();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource<any>(changes.accounts.currentValue)
    console.log(this.dataSource)
  }

// nastavi používateľovi práva admina
  onAddAdminClickNotify(accountName: string) {
    this.accountsService.addAdmin(accountName).subscribe(
      data => {
        this.accountsService.loadAllAccounts();
      },
      error => {
        console.log(error);
      }
    );
  }

  onRemoveAdminClickNotify(accountName: string) {
    this.accountsService.removeAdmin(accountName).subscribe(
      data => {
        this.accountsService.loadAllAccounts();
      },
      error => {
        console.log(error);
      }
    );
  }

  onRemoveAccountClickNotify(accountName: string) {
      this.accountsService.removeAccount(accountName).subscribe(
      data => {
        this.accountsService.loadAllAccounts();
      },
      error => {
        console.log(error);
      }
    );
  }
}

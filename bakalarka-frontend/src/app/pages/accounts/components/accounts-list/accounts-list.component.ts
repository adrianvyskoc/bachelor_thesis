import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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

  /**
   * Nastavi používateľovi práva admina
   * @param accountName - e-mail používateľa
   */
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

   /**
   * Odstráni používateľovi práva admina
   * @param accountName - e-mail používateľa
   */
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

   /**
   * Odstráni používateľovi prístup do systému
   * @param accountName - e-mail používateľa
   */
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

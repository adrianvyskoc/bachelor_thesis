import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
// import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-accounts-item',
  templateUrl: './accounts-item.component.html',
  styleUrls: ['./accounts-item.component.scss']
})
export class AccountsItemComponent implements OnInit {
  @Input('account') account: any
  @Output() onRemoveClickNotifier: EventEmitter<string> = new EventEmitter<string>()
  @Output() onDeleteClickNotifier: EventEmitter<string> = new EventEmitter<string>()

  // myData = ['prvy stlpec', 'druhy stlpec']
  // displayedAccountsColumns = ['email', 'admin']


  // dataSource = new MatTableDataSource(this.myData)

  constructor() { }

  ngOnInit() {
  }

  onRemoveClick(email: string) {
    this.onRemoveClickNotifier.emit(email)
  }

  onDeleteClick(email: string) {
    this.onDeleteClickNotifier.emit(email)
  }

  // _displayedColumnsAndNothing() {
  //   return [...this.displayedAccountsColumns, 'NIC']
  // }
}

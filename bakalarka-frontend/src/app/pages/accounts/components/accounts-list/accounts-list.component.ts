import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit {
  @Input('accounts') accounts: any[]
  @Output() onRemoveClickNotifier: EventEmitter<string> = new EventEmitter<string>()

  constructor() { }

  ngOnInit() {
  }

  onRemoveClickNotify(accountName: string) {
    this.onRemoveClickNotifier.emit(accountName)
  }
}

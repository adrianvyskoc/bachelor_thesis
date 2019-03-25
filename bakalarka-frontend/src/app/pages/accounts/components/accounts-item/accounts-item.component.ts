import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accounts-item',
  templateUrl: './accounts-item.component.html',
  styleUrls: ['./accounts-item.component.scss']
})
export class AccountsItemComponent implements OnInit {
  @Input('account') account: any
  @Output() onRemoveClickNotifier: EventEmitter<string> = new EventEmitter<string>()

  constructor() { }

  ngOnInit() {
  }

  onRemoveClick(email: string) {
    this.onRemoveClickNotifier.emit(email)
  }
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accounts-form',
  templateUrl: './accounts-form.component.html',
  styleUrls: ['./accounts-form.component.scss']
})
export class AccountsFormComponent implements OnInit {
  @Output() onFormSubmitNotifier: EventEmitter<string> = new EventEmitter<string>()
  username: string

  constructor() { }

  ngOnInit() {
  }

  submitForm() {
    this.onFormSubmitNotifier.emit(this.username)
    this.username = null
  }

}

import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-accounts-form',
  templateUrl: './accounts-form.component.html',
  styleUrls: ['./accounts-form.component.scss']
})
export class AccountsFormComponent implements OnInit {
  username: string;

  constructor(
    @Inject(AccountsService) private accountsService: AccountsService
  ) {}

  ngOnInit() {}

  submitForm() {
    this.accountsService.addAccount(this.username).subscribe(
      () => {
        this.accountsService.loadAllAccounts();
        this.username = null;
      },
      error => {
        console.log(error);
      }
    );
  }
}

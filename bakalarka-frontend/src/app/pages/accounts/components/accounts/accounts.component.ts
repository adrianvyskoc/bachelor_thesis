import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';
import { User } from 'src/app/model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  // accounts: Array<User> = [];

  constructor() {}

  ngOnInit() { }

}

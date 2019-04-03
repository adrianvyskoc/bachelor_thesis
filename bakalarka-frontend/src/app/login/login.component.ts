import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AccountsService } from '../pages/accounts/services/accounts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  _email: string = "xkaderabekova"
  _password: string = "EssaVanessa13"

  constructor(
    private authService: AuthService,
    private accountService: AccountsService,
  ) { }

  ngOnInit() {
  }

  submitForm() {
    this.authService.loginUser(this._email, this._password)
    // this.accountService.isAdmin(this._email).subscribe(user => console.log('from backend', user[0].admin) )
  }

  get email() {
    return this._email
  }

  set email(pattern: string) {
    this._email = pattern
  }

  get password() {
    return this._password
  }

  set password(pattern: string) {
    this._password = pattern
  }
}

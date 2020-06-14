import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AccountsService } from '../pages/accounts/services/accounts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  _email: string = ""
  _password: string = ""
  authResult: any  

  constructor(
    public authService: AuthService,
    private accountService: AccountsService,
  ) { }

  ngOnInit() {
  }

  submitForm() {
    this.authService.authUser(this._email, this._password)
      .subscribe(
        data => {
          this.authResult = data;
          // console.log(this.authResult);
          if(this.authResult.type === 'success') {
            this.authService.loginUser(this.authResult.auth, this._email);
          }
        },
        error => {
          console.log(error);
        }
      )
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

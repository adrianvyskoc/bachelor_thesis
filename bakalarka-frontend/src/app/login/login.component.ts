import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  _email: string
  _password: string

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  submitForm() {
    this.authService.loginUser(this._email, this._password)
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

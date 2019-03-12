import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean

  constructor( private http: HttpClient) {
    this.loggedIn = false

    if(localStorage.getItem('user')) {
      this.loggedIn = true
    }
  }

  loginUser(email: string, password: string) {
    let user = {
      email: email,
      date: new Date()
    }

    let requestData = {
      email: email,
      password: password
    }
    this.http.post(`http://localhost:3333/api/login`, requestData)
    .subscribe(
      response => {
        console.log(response)
        if(response) {
          this.loggedIn = true
          localStorage.setItem('user', JSON.stringify(user))
        }
        else {
          this.loggedIn = false
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  logoutUser() {
    localStorage.removeItem('user')
    this.loggedIn = false;
  }
}

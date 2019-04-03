import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean
  isAdmin: boolean

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const user: any = JSON.parse(localStorage.getItem('user'))
    this.loggedIn = false
    this.isAdmin = false

    if (user && user.hasAccess) {
      this.loggedIn = true
    }
    if(user && user.isAdmin) {
      this.isAdmin = true
    }
  }

  loginUser(email: string, password: string) {
    let user = {
      email: email,
      isAdmin: false,
      hasAccess: false,
      date: new Date()
    }

    let requestData = {
      email: email,
      password: password
    }

    this.http.post(`http://localhost:3333/api/login`, requestData)
      .subscribe(
        response => {
          let res: any = response
          if(res.access) {
            if(res.admin) {
              this.isAdmin = true
              user.isAdmin = true
            }
            this.loggedIn = true
            user.hasAccess = true
            localStorage.setItem('user', JSON.stringify(user))
            this.router.navigate(['dashboard'])
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
    this.isAdmin = false;
  }
}

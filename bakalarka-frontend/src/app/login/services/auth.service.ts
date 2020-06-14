import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn: boolean
  public isAdmin: boolean

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const user: any = JSON.parse(sessionStorage.getItem('user'))
    this.loggedIn = false
    this.isAdmin = false

    if (user && user.hasAccess) {
      this.loggedIn = true
    }
    if(user && user.isAdmin) {
      this.isAdmin = true
    }
  }

  authUser(email: string, password: string): Observable<any> {
    let requestData = {
      email: email,
      password: password
    }

    return this.http.post(`http://localhost:3333/api/login`, requestData);
  }

  loginUser(auth: any, email: string) {
    let user = {
      email: email,
      isAdmin: false,
      hasAccess: false,
      date: new Date()
    }

    if(auth.access) {
      if(auth.admin) {
        this.isAdmin = true
        user.isAdmin = true
      }
      this.loggedIn = true
      user.hasAccess = true
      sessionStorage.setItem('user', JSON.stringify(user))
      this.router.navigate(['dashboard'])
    }
    else {
      this.loggedIn = false
    }
  }

  logoutUser() {
    sessionStorage.removeItem('user')
    this.loggedIn = false;
    this.isAdmin = false;
  }
}

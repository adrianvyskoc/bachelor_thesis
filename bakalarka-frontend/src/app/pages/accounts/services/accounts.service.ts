import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  // TODO Make accounts asObservable & store it in service
  private accounts: any[]
  private accountsUpdated = new Subject<any[]>()

  constructor(
    private http: HttpClient,
  ) { }

  getAllAccounts() {
    return this.http.get(`http://localhost:3333/api/administrators`)
  }

  addAccount(accountName: string) {
    return this.http.get(`http://localhost:3333/api/administrators/add/${accountName}`)
  }

  removeAccount(accountName: string) {
    return this.http.get(`http://localhost:3333/api/administrators/remove/${accountName}`)
  }
}

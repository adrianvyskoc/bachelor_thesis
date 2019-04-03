import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private accounts$: BehaviorSubject<Array<User>> = new BehaviorSubject([]);
  public readonly accounts: Observable<Array<User>> = this.accounts$.asObservable();

  private accountsUpdated = new Subject<any[]>()

  constructor(
    private http: HttpClient,
  ) { }

  loadAllAccounts(): void {
    this.getAllAccounts().subscribe((data: Array<User>) => {
        this.accounts$.next(data);
    });
  }

  getAllAccounts(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${environment.apiUrl}/api/administrators`)
  }


  // prida pristup cize usera
  addAccount(accountName: string) {
    return this.http.post(`${environment.apiUrl}/api/administrators/addUser`, {name: accountName})
  }

  // prida admin prava
  addAdmin(accountName: string) {
    return this.http.post(`${environment.apiUrl}/api/administrators/addAdmin`, {name: accountName})
  }

  // odstrani pristup
  removeAccount(accountName: string) {
    return this.http.post(`${environment.apiUrl}/api/administrators/removeUser`, {name: accountName})
  }

  // odstrani admin prava
  removeAdmin(accountName: string) {
    return this.http.post(`${environment.apiUrl}/api/administrators/removeAdmin`, {name: accountName})
  }

  // isAdmin(accountName: string): Observable<boolean> {
  //   return this.http.get<boolean>(`${environment.apiUrl}/api/administrators/getIfIsAdmin/${accountName}`)
  // }
  
}

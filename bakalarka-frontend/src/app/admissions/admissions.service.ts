import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmissionsService {
  admissionsChanged = new Subject()
  admissions

  constructor(
    private http: HttpClient
  ) { }

  getAdmissions() {
    return this.http.get(`http://localhost:3333/api/getAdmissions`)
      .subscribe(
        admissions => {
          this.admissions = admissions
          this.admissionsChanged.next([...this.admissions])
        }
      )
  }

  getAdmission(id) {
    return this.http.get(`http://localhost:3333/api/getAdmission/${id}`)
  }

  // update listeners
  getAdmissionsUpdateListener() {
    return this.admissionsChanged.asObservable()
  }
}

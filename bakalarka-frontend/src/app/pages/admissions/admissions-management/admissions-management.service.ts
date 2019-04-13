import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdmissionsManagementService {

  private url: string = 'http://localhost:3333/api/'

  constructor(
    private http: HttpClient
  ) { }

  getAdmissionsByName(name: string) {
    return this.http.get(`${this.url}admissionsBySurname?surname=${name}`)
  }

  deleteAdmission(id) {
    return this.http.delete(`${this.url}admissions/${id}/delete`)
  }

  updateAdmission(admission) {
    return this.http.put(`${this.url}admissions/${admission.id}/update`, admission)
  }

  deleteAllAdmissions() {
    return this.http.delete(`${this.url}admissions/delete/all`)
  }

  deleteAdmissionsForGivenYear(year) {
    return this.http.delete(`${this.url}admissions/delete/${year}`)
  }
}

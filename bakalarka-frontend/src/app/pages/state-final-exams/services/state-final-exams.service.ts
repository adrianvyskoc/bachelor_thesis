import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Exam } from 'src/app/model';

@Injectable({
  providedIn: 'root'
})
export class StateFinalExamsService {

  constructor(
    private http: HttpClient,
  ) { }
  
  getAllStateFinalExams(): Observable<Array<Exam>> {
    return this.http.get<Array<Exam>>(`${environment.apiUrl}/api/statefinalexamsbc`)
  } 

  updateStateFinalExams(exam: Exam): Observable<Array<Exam>> {
    return this.http.post<any>(`${environment.apiUrl}/api/statefinalexamsbc/update`, exam)
  }

  getAllStateFinalExamsIng(): Observable<Array<Exam>> {
    return this.http.get<Array<Exam>>(`${environment.apiUrl}/api/statefinalexamsing`)
  } 

  updateStateFinalExamsIng(exam: Exam): Observable<Array<Exam>> {
    return this.http.post<any>(`${environment.apiUrl}/api/statefinalexamsing/update`, exam)
  }
}

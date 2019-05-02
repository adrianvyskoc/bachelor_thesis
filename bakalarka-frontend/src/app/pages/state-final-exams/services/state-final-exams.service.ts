import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Exam, Param } from 'src/app/model';

@Injectable({
  providedIn: 'root'
})
export class StateFinalExamsService {
  constructor(
    private http: HttpClient,
  ) { }

  getAllStateFinalExams(year: string): Observable<Array<Exam>> {
    const reqData = {
      year: year
    };
    return this.http.post<Array<Exam>>(`${environment.apiUrl}/api/statefinalexamsbc`, reqData)
  }
  
  updateStateFinalExams(exam: Exam): Observable<Array<Exam>> {
    return this.http.post<any>(`${environment.apiUrl}/api/statefinalexamsbc/update`, exam)
  }

  getYearDates(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.apiUrl}/api/statefinalexamsbc/year`)
  }

  getFinalExamConfiguration(): Observable<Param> {
    return this.http.get<any>(`${environment.apiUrl}/api/finalexamconfig/get`)
  }
  
  updateFinalExamConfiguration(configObj: Param): Observable<Param> {
    return this.http.post<any>(`${environment.apiUrl}/api/finalexamconfig/update`, configObj)
  }

  /**
   * ING
   */
  getAllStateFinalExamsIng(): Observable<Array<Exam>> {
    return this.http.get<Array<Exam>>(`${environment.apiUrl}/api/statefinalexamsing`)
  }

  updateStateFinalExamsIng(exam: Exam): Observable<Array<Exam>> {
    return this.http.post<any>(`${environment.apiUrl}/api/statefinalexamsing/update`, exam)
  }
}

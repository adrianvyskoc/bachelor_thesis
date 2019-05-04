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

  /** -----------------------------------------------------------------------
   * State Final Exams BC
   * ------------------------------------------------------------------------*/

  getAllStateFinalExams(year: string): Observable<Array<Exam>> {
    const reqData = {
      year: year
    };
    return this.http.post<Array<Exam>>(`${environment.apiUrl}/api/statefinalexamsbc`, reqData)
  }
  
  updateStateFinalExams(exam: Exam): Observable<Array<Exam>> {
    return this.http.post<any>(`${environment.apiUrl}/api/statefinalexamsbc/update`, exam)
  }

  deleteStateFinalExams(year: string): Observable<Array<Exam>> {
    const reqData = {
      year: year
    };
    return this.http.post<any>(`${environment.apiUrl}/api/statefinalexamsbc/delete`, reqData)
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

  
  /** -----------------------------------------------------------------------
   * State Final Exams ING
   * ------------------------------------------------------------------------*/
  getAllStateFinalExamsIng(year: string): Observable<Array<Exam>> {
    const reqData = {
      year: year
    };
    return this.http.post<Array<Exam>>(`${environment.apiUrl}/api/statefinalexamsing`, reqData)
  }
  
  updateStateFinalExamsIng(exam: Exam): Observable<Array<Exam>> {
    return this.http.post<any>(`${environment.apiUrl}/api/statefinalexamsing/update`, exam)
  }

  deleteStateFinalExamsIng(year: string): Observable<Array<Exam>> {
    const reqData = {
      year: year
    };
    return this.http.post<any>(`${environment.apiUrl}/api/statefinalexamsing/delete`, reqData)
  }


  getYearDatesIng(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.apiUrl}/api/statefinalexamsing/year`)
  }

  getFinalExamConfigurationIng(): Observable<Param> {
    return this.http.get<any>(`${environment.apiUrl}/api/finalexamconfiging/get`)
  }
  
  updateFinalExamConfigurationIng(configObj: Param): Observable<Param> {
    return this.http.post<any>(`${environment.apiUrl}/api/finalexamconfiging/update`, configObj)
  }

}

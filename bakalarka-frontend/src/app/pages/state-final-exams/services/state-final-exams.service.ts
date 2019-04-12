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
    return this.http.get<Array<Exam>>(`${environment.apiUrl}/api/statefinalexams`)
  } 

}

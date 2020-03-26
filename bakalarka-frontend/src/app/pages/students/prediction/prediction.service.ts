import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRiskyStudent } from './IRiskyStudent';
import { map } from 'rxjs/operators'
import { IResponse } from './IResponse';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  list: Observable<IRiskyStudent[]>

  constructor(private http: HttpClient) { }

  predict(school_year, subject): Observable<IResponse> {
    return this.http.get<IResponse>(`http://localhost:3333/api/predictions/predict?school_year=${school_year}&subject=${subject}`, {responseType: 'json'})
    
  }

  helloPython() {
   
    var data = this.http.get(`http://localhost:3333/api/predictions`)
   
    return data

   
  }
}

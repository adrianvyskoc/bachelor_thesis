import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor(private http: HttpClient) { }

  helloPython() {
   
    var data = this.http.get(`http://localhost:3333/api/predictions`)
   
    return data

   
  }
}

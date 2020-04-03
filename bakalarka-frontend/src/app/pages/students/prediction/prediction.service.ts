import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { IResponse } from './IResponse';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor(private http: HttpClient) { }

  predict(school_year, subject): Observable<IResponse> {
    return this.http.get<IResponse>(`http://localhost:3333/api/predictions/predict?school_year=${school_year}&subject=${subject}`, {responseType: 'json'})
  }

  get_subjects() {
    return this.http.get(`http://localhost:3333/api/predictions/get_subjects`)
  }

  get_all_models() {
    return this.http.get(`http://localhost:3333/api/predictions/get_all_models`)
  }

  get_model(model_id) {
    return this.http.get(`http://localhost:3333/api/predictions/get_model?model_id=${model_id}`)
  }

  get_imputers(model_id) {
    return this.http.get(`http://localhost:3333/api/predictions/get_imputers?model_id=${model_id}`)
  }

  delete_model(model_id) {
    return this.http.get(`http://localhost:3333/api/predictions/delete_model?model_id=${model_id}`)
  }

  // get_available_years() {
  //   return this.http.get(`http://localhost:3333/api/predictions/get_years`)
  // }

  get_data_for_create_form() {
    let years = this.http.get(`http://localhost:3333/api/predictions/get_years`);
    let tables = this.http.get(`http://localhost:3333/api/predictions/get_tables`);
    let subjects = this.http.get(`http://localhost:3333/api/predictions/get_all_subjects`);
    return forkJoin([years, tables, subjects])
  }

  helloPython() {
   
    var data = this.http.get(`http://localhost:3333/api/predictions`)
   
    return data

   
  }
}

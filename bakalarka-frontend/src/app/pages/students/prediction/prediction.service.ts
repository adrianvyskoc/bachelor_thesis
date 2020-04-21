import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { IResponse } from './IResponse';
import { IRiskyStudent } from './IRiskyStudent';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor(private http: HttpClient) { }

  loading = false
  showErrorMessage = false
  showSuccessMessage = false

 

  ErrorMessage = ''

  //refresh dostupnych modelov 
  invokeRefreshModelImport = new EventEmitter();    
  subsVar: Subscription;

   //refresh dostupnych modelov v spustani predikcie
   invokeRefreshModelPrediction = new EventEmitter();    
   subsVarPrediction: Subscription;

  RefreshAvailableModels() {
    this.invokeRefreshModelImport.emit()
    this.invokeRefreshModelPrediction.emit()
  }


  //http volania

  predict(school_year, model_id) {
    return this.http.get<IRiskyStudent[]>(`http://localhost:3333/api/predictions/predict?school_year=${school_year}&model_id=${model_id}`)

  }

  get_subjects() {
    return this.http.get(`http://localhost:3333/api/predictions/get_subjects`)
  }

  get_all_models() {
    return this.http.get(`http://localhost:3333/api/predictions/get_all_models`)
  }

  get_models(subject) {
    return this.http.get(`http://localhost:3333/api/predictions/get_models?subject=${subject}`)
  }

  get_model(model_id) {
    return this.http.get(`http://localhost:3333/api/predictions/get_model?model_id=${model_id}`)
  }

  get_model_details(model_id) {
    return this.http.get(`http://localhost:3333/api/predictions/get_model_details?model_id=${model_id}`)
  }

  get_imputers(model_id) {
    return this.http.get(`http://localhost:3333/api/predictions/get_imputers?model_id=${model_id}`)
  }

  delete_model(model_id) {
    return this.http.get(`http://localhost:3333/api/predictions/delete_model?model_id=${model_id}`)
  }

  get_data_for_create_form() {
    let years = this.http.get(`http://localhost:3333/api/predictions/get_years`);
    let tables = this.http.get(`http://localhost:3333/api/predictions/get_tables`);
    let subjects = this.http.get(`http://localhost:3333/api/predictions/get_all_subjects`);
    return forkJoin([years, tables, subjects])
  }

  async create_model(name, subject, years, tables) {
    const fd = new FormData()
    fd.append('name', name)
    fd.append('subject', subject)
    fd.append('years', years)
    fd.append('tables', tables)

    await this.http.post(`http://localhost:3333/api/predictions/create_model`, fd)
    .subscribe(
      res => {
        this.loading = false
        this.showSuccessMessage = true

        setTimeout(() => {
          this.showSuccessMessage = false
        }, 5000)

        this.RefreshAvailableModels()

      },
      error => {
        
        console.error(error)
        if (error.status == 505) {
          this.ErrorMessage = error.error
        }
       
        this.loading = false
        this.showErrorMessage = true

        setTimeout(() => {
          this.showErrorMessage = false
        }, 5000)
      }
    )
  }

  helloPython() {
   
    var data = this.http.get(`http://localhost:3333/api/predictions`)
   
    return data

   
  }
}

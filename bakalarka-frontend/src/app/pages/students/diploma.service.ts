import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiplomaService {

  

  constructor(
    private http: HttpClient
  ) { }

  addDiploma(AIS_ID: string, OBDOBIE: string, Prijatie_na_program: string, type: string, diploma_title: string, round: string, position: string) {
    return this.http.post<any>("http://localhost:3333/api/students/diploma/add", {
      AIS_ID, OBDOBIE, Prijatie_na_program, type, diploma_title, round, position
    });
  }
  
  


  addDiplomaExtra(AIS_ID: string, OBDOBIE: string, Prijatie_na_program: string, type: string, diploma_title: string, round: string, position: string, points: number) {
    return this.http.post<any>("http://localhost:3333/api/students/diploma/addExtra", {
      AIS_ID, OBDOBIE, Prijatie_na_program, type, diploma_title, round, position, points
    });
  }

  

}

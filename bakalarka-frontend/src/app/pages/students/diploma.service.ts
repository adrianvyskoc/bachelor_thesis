import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiplomaService {

  constructor(
    private http: HttpClient
  ) { }

  addDiploma(AIS_ID: string, diploma_title: string, position: string) {
    this.http.post<any>("http://localhost:3333/api/students/diploma/add", {
      AIS_ID, diploma_title, position
    }).subscribe((data) => {
      console.log(data)
    });
  }
}

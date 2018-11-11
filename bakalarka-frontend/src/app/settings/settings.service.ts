import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private attendanceTypesChanged = new Subject();

  constructor(private http: HttpClient) { }

  getCodebookData(type) {
    switch(type) {
      case 'AttendanceTypes': 
        return this.http.get(`http://localhost:3333/api/codebook/get${type}`);
    }
  }

  createAttendanceType(newAttendanceType) {
    this.http.post('http://localhost:3333/api/codebook/attendanceType', newAttendanceType)
      .subscribe(
        (data) => {
          console.log(data)
        },
        (err) => {
          console.log(err)
        }
      );
  }
}

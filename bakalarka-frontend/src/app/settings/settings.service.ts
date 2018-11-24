import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private attendanceTypesChanged = new Subject();

  constructor(private http: HttpClient) { }

  getAttendanceTypesUpdateListener() {
    return this.attendanceTypesChanged.asObservable();
  }

  getCodebookData(type) {
    switch(type) {
      case 'attendanceTypes': 
        this.http.get(`http://localhost:3333/api/codebook/${type}`) 
          .subscribe(
            (attendanceTypes: []) => {
              this.attendanceTypesChanged.next(attendanceTypes)
            }
          )
    }
  }

  createAttendanceType(type , newAttendanceType) {
    this.http.post(`http://localhost:3333/api/codebook/${type}`, newAttendanceType)
      .subscribe(
        () => {
          this.getCodebookData(type)
        },
        (err) => {
          console.log(err)
        }
      );
  }
}

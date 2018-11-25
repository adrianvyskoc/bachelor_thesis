import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private attendanceTypesChanged = new Subject();
  private highSchoolTypesChanged = new Subject();

  constructor(private http: HttpClient) { }

  getUpdateListener(type) {
    switch (type) {
      case 'attendanceTypes':
        return this.attendanceTypesChanged.asObservable()
  
      case 'highSchoolTypes':
        return this.highSchoolTypesChanged.asObservable()

    }
  }

  getCodebookData(type) {
    this.http.get(`http://localhost:3333/api/codebook/${type}`) 
      .subscribe(
        (data: []) => {
          switch(type) {
            case 'attendanceTypes': 
              this.attendanceTypesChanged.next(data)
              break
      
            case 'highSchoolTypes':
              this.highSchoolTypesChanged.next(data)
              break
          }
        }
      )


    
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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private attendance = []
  private students = []
  private schools = []
  private grades = []
  private attendanceChanged = new Subject<{}>()
  private studentsChanged = new Subject<{}>()
  private schoolsChanged = new Subject<{}>()
  private gradesChanged = new Subject<{}>()

  loading = false
  showErrorMessage = false

  constructor(private http: HttpClient) { }

  getData(selectedImport) {
    this.http.get<Object[]>(`http://localhost:3333/api/get${selectedImport}`)
      .subscribe(
        data => {
          switch(selectedImport) {

            case 'Attendance':
              this.attendance = data
              this.attendanceChanged.next([...this.attendance])
              break

            case 'Students':
              this.students = data
              this.studentsChanged.next([...this.students])
              break

            case 'Grades':
              this.grades = data
              this.gradesChanged.next([...this.grades])
              break

            case 'Schools': 
              this.schools = data
              this.schoolsChanged.next([...this.schools])
              break
          }
        }
      )
  }

  getAttendanceUpdateListener() {
    return this.attendanceChanged.asObservable()
  }

  getStudentsUpdateListener() {
    return this.studentsChanged.asObservable()
  }

  getSchoolsUpdateListener() {
    return this.schoolsChanged.asObservable()
  }

  getGradesUpdateListener() {
    return this.gradesChanged.asObservable()
  }

  async uploadData(selectedFile, selectedImport, selectedAction) {
    const fd = new FormData()
    fd.append(selectedImport, selectedFile, selectedFile.name)

    await this.http.post('http://localhost:3333/api/import/' + selectedImport + '/' + selectedAction, fd)
      .subscribe(
        res => {
          console.log(res);
          this.getData(selectedImport)
          this.loading = false
        },
        error => {
          console.log(error)
          this.loading = false
          this.showErrorMessage = true
        }
      )
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private attendance = []
  private admissions = []
  private students = []
  private schools = []
  private grades = []
  private attendanceChanged = new Subject<{}>()
  private admissionsChanged = new Subject<{}>()
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

            case 'Admissions':
              this.admissions = data
              this.admissionsChanged.next([...this.admissions])
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

  getAdmissionsUpdateListener() {
    return this.admissionsChanged.asObservable()
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

  async uploadData(selectedFile, selectedImport, selectedSource) {
    const fd = new FormData()
    fd.append(selectedImport, selectedFile, selectedFile.name)

    await this.http.post('http://localhost:3333/api/import/' + selectedSource + '/' + selectedImport, fd)
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

  loadColumnMeaning(type) {
    return this.http.get(`http://localhost:3333/api/column-meaning/${type}`)
  }
}

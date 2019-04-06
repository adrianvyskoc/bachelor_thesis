import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
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
  private importedYearsChanged = new Subject<{}>()

  private admissionsOverviewChanged = new Subject<{}>()
  private admissionsBachelorChanged = new Subject<{}>()
  private admissionsMasterChanged = new Subject<{}>()
  private admissionsYearComparisonChanged = new Subject<{}>()

  private year = new BehaviorSubject('all')

  loading = false
  showErrorMessage = false
  showSuccessMessage = false

  constructor(
    private http: HttpClient,
  ) { }

  setYear(year) {
    this.year.next(year)
    this.getAdmissionsBachelor()
    this.loadAdmissionsOverview()
  }

  getYear() {
    return this.year
  }

  getImportedYears() {
    return this.http.get(`http://localhost:3333/api/importedYears`)
      .subscribe(years => this.importedYearsChanged.next(years))
  }

  getData(selectedImport) {
    const url = selectedImport ==
      'Schools' ?
        `http://localhost:3333/api/get${selectedImport}` :
        `http://localhost:3333/api/get${selectedImport}/${this.year.value}`

    this.http.get<Object[]>(url)
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

  getAdmission(id) {
    return this.http.get(`http://localhost:3333/api/getAdmission/${id}`)
  }

  loadAdmissionsOverview() {
    this.http.get(`http://localhost:3333/api/admissionsOverview?year=${this.year.value}`)
      .subscribe(data => this.admissionsOverviewChanged.next(data))
  }

  getAdmissionsBachelor() {
    this.http.get(`http://localhost:3333/api/admissionsBachelor?year=${this.year.value}`)
      .subscribe(data => this.admissionsBachelorChanged.next(data))
  }

  getAdmissionsMaster() {
    this.http.get(`http://localhost:3333/api/admissionsMaster?year=${this.year.value}`)
      .subscribe(data => this.admissionsMasterChanged.next(data))
  }

  getAdmissionsYearComparison() {
    this.http.get(`http://localhost:3333/api/admissionsYearComparison`)
      .subscribe(data => this.admissionsYearComparisonChanged.next(data))
  }

  getAdmissionsOverviewUpdateListener() {
    return this.admissionsOverviewChanged.asObservable()
  }

  getAdmissionsYearComparisonUpdateListener() {
    return this.admissionsYearComparisonChanged.asObservable()
  }

  getAdmissionsBachelorUpdateListener() {
    return this.admissionsBachelorChanged.asObservable()
  }

  getAdmissionsMasterUpdateListener() {
    return this.admissionsMasterChanged.asObservable()
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

  getImportedYearsUpdateListener() {
    return this.importedYearsChanged.asObservable()
  }

  async uploadData(selectedFile, selectedImport, selectedSource, year) {
    this.showErrorMessage = false
    this.showErrorMessage = false
    const fd = new FormData()
    fd.append(selectedImport, selectedFile, selectedFile.name)

    await this.http.post('http://localhost:3333/api/import/' + selectedSource + '/' + selectedImport + '/' + year, fd)
      .subscribe(
        res => {
          this.getData(selectedImport)
          this.getImportedYears()
          this.loading = false
          this.showSuccessMessage = true
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

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

  private admissionsOverviewChanged = new Subject<{}>()
  private admissionsBachelorChanged = new Subject<{}>()
  private admissionsMasterChanged = new Subject<{}>()
  private admissionsYearComparisonChanged = new Subject<{}>()

  private year = new BehaviorSubject('all')

  loading = false
  showErrorMessage = false
  showSuccessMessage = false

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Funkcia zodpovedná za nastavenie školského roku, s ktorým chceme pracovať (dáta budú z tohto roku)
   * @param year - rok, ktorý chceme nastaviť
   */
  setYear(year) {
    this.year.next(year)
    this.getAdmissionsBachelor()
    this.getAdmissionsMaster()
    this.loadAdmissionsOverview()
  }

  /**
   * Funkcia, ktorá vracia daný školský rok
   */
  getYear() {
    return this.year
  }

  /**
   * Funkcia zodpovedná za získanie dát zo servera.
   * @param selectedImport - typ importu, pre ktorý chceme získať dáta (Admissions, Schools...)
   */
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

  /**
   * Funkcia, ktorá vracia observable, ktorž obsahuje prihlášku podľa identifikátora
   * @param id - identifikátor prihlášky, na ktorú sa dopytujeme
   */
  getAdmission(id) {
    return this.http.get(`http://localhost:3333/api/getAdmission/${id}`)
  }

  /**
   * Nasledovné 4 funkcie sú zodpovedné za vyžiadanie dát si pre jednotlivé sekcie:
   *  - /admissionsOverview
   *  - /admissionsBachelor
   *  - /admissionsMaster
   *  - /admissionsYearComparison
   */
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

  getStudent(id: number) {
    return this.http.get(`http://localhost:3333/api/student/${id}`)
  }

  /**
   * Nasledonvých 9 funkcií vracia listener na zmenu dát pre jednotlivé typy dát
   */
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

  /**
   * Funkcia zodpovedná za odoslanie požiadavky na server s účelom importovania dát do systému
   * @param selectedFile - súbor, z ktorého chceme dáta importovať
   * @param selectedImport - typ importu, ktorý realizujeme (Admissions, Schools, Pointers, Grades...)
   * @param selectedSource - zdroj dát (ineko/ais)
   * @param year - zvolený školský rok, pre ktorý robíme import
   * @param mapping - mapovanie atribútov objekt obsahujúci key/value dvojice key - atribút zo vstupného súboru, value - atribút z DB
   */
  async uploadData(selectedFile, selectedImport, selectedSource, year, mapping, semester) {
    this.showSuccessMessage = false
    this.showErrorMessage = false
    const fd = new FormData()
    fd.append(selectedImport, selectedFile, selectedFile.name)
    fd.append('mapping', JSON.stringify(mapping))
    fd.append('year', year)

    if(semester)
      fd.append('semester', semester)

    await this.http.post('http://localhost:3333/api/import/' + selectedSource + '/' + selectedImport, fd)
      .subscribe(
        res => {
          this.loading = false
          this.showSuccessMessage = true

          setTimeout(() => {
            this.showSuccessMessage = false
          }, 5000)
        },
        error => {
          console.error(error)
          this.loading = false
          this.showErrorMessage = true

          setTimeout(() => {
            this.showErrorMessage = false
          }, 5000)
        }
      )
  }

  /**
   * Funkcia, ktorá vráti observable s názvami stĺpcov pre zvolenú tabuľku
   * @param tableName - názov tabuľky z databázy
   */
  getAttrNames(tableName: string) {
    return this.http.get(`http://localhost:3333/api/tableColumns?tableName=${tableName}`)
  }
}

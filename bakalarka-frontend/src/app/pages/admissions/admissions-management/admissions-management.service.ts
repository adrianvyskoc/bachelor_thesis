import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdmissionsManagementService {

  private url: string = 'http://localhost:3333/api/'

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Funkcia, ktorá vracia observable, ktorá obsahuje prihlášky podľa zvoleného priezviska
   * @param surname - priezvisko, podľa ktorého hľadáme prihlášky
   */
  getAdmissionsByName(surname: string) {
    return this.http.get(`${this.url}admissionsBySurname?surname=${surname}`)
  }

  /**
   * Funkcia, ktorá zmaže prihlášku zo systému podľa zvoleného identifikátora
   * @param id - identifikátor prihlášky, ktorú chceme vymazať zo systému
   */
  deleteAdmission(id) {
    return this.http.delete(`${this.url}admissions/${id}/delete`)
  }

  /**
   * Funkcia, ktorá upraví prihlášku v systéme
   * @param admission - prihláška s novými hodnotami, ktorú chceme upraviť
   */
  updateAdmission(admission) {
    return this.http.put(`${this.url}admissions/${admission.id}/update`, admission)
  }

  /**
   * Funkcia, ktorá zmaže všetky prihlášky zo systému
   */
  deleteAllAdmissions() {
    return this.http.delete(`${this.url}admissions/delete/all`)
  }

  /**
   * Funkcia, ktorá zmaže prihlášky pre zvolený školský rok
   * @param year - školský rok, pre ktorý chceme zmazať prihlášky
   */
  deleteAdmissionsForGivenYear(year) {
    return this.http.delete(`${this.url}admissions/delete/${year}`)
  }

  /**
   * Funkcia, ktorá zmaže dáta z ineka zvoleného typu pre zvolený školský rok
   * @param data - objekt obsahujúci školský rok, pre ktorý mažeme dáta a názov dát, ktoré chceme zmazať
   */
  deleteInekoDataForGivenYear(data) {
    return this.http.delete(`${this.url}admissions/delete/${data.year}/${data.inekoData}`)
  }

  /**
   * Funkcia, ktorá prepíše zvolený pôvodný školský rok na zvolený cieľový školský rok pre prihlášky
   * @param years - objekt, ktorý obsahuje pôvodný a cieľový školský rok (from - pôvodný, to - cieľový)
   */
  changeSchoolYearForGivenYear(years) {
    return this.http.put(`${this.url}admissions/changeYear`, years)
  }

  /**
   * Funkcia, ktorá prepíše zvolený pôvodný školský rok na zvolený cieľový školský rok pre dáta z ineka
   * @param data  - objekt, ktorý obsahuje pôvodný a cieľový školský rok (from - pôvodný, to - cieľový) a typ dát, ktorým chceme meniť rok
   */
  changeSchoolYearForInekoDataForGivenYear(data) {
    return this.http.put(`${this.url}admissions/changeYearForInekoData`, data)
  }
}

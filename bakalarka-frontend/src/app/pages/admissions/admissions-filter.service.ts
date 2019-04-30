import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AdmissionsFilterService {

  constructor() {}

  /**
   * Filtrovanie podľa typu školy (gymnázium, odborné školy, ostatné)
   * @param admissions - všetky prihlášky, ktoré ideme filtrovať
   * @param value - hodnota, podľa ktorej ideme filtrovať
   */
  filterBySchoolType(admissions, value) {
    if(value == 'gymnasium')
      return admissions.filter(admission => ['Gymnázium', 'Športové gymnázium'].indexOf(admission.typ_skoly) > -1)
    else if(value == 'technical')
      return admissions.filter(admission => admission.typ_skoly == 'Stredná odborná škola')
    else if(value == 'other')
      return admissions.filter(admission => ['Gymnázium', 'Športové gymnázium', 'Stredná odborná škola'].indexOf(admission.typ_skoly) == -1)
  }

  /**
   * Filtrovanie podľa typu štúdia (4 ročný, 3 ročný)
   * @param admissions - všetky prihlášky, ktoré ideme filtrovať
   * @param value - hodnota, podľa ktorej ideme filtrovať
   */
  filterByStudyType(admissions, value) {
    if(value !== 3 || value !== 4)
      return []

    if(value == 4)
      return admissions.filter(admission => admission.Program_1[admission.Program_1.length - 1] == "4")
    else
      return admissions.filter(admission => admission.Program_1[admission.Program_1.length - 1] !== "4")
  }

  /**
   * Filtrovanie podľa pohlavia (muž, žena)
   * @param admissions - všetky prihlášky, ktoré ideme filtrovať
   * @param value - hodnota, podľa ktorej ideme filtrovať
   */
  filterByGender(admissions, value) {
    return admissions.filter(admission => admission.Pohlavie == value)
  }

  /**
   * Filtrovanie podľa roku maturity
   * @param admissions - všetky prihlášky, ktoré ideme filtrovať
   * @param value - hodnota, podľa ktorej ideme filtrovať
   */
  filterByGraduationYear(admissions, value) {
    if(!value || value == 'all')
      return admissions

    return admissions.filter(admission => admission.Maturita_1 == value)
  }

  /**
   * Filtrovanie podľa typu bodov, ktorými bol daný uchádzač prijímaný na štúdium
   * @param admissions - všetky prihlášky, ktoré ideme filtrovať
   * @param value - hodnota, podľa ktorej ideme filtrovať - počet bodov
   * @param type - typ bodov, ktoré berieme do úvahy (SCIO, VŠP, Maturita z ANJ...)
   */
  filterByPoints(admissions, value, type) {
    if(type == "notprovided") {
      return admissions.filter(admission => {
        return admission['Všeobecné_študijné_predpoklady_SCIO_VŠP'] == null && admission['Písomný_test_z_matematiky_SCIO_PTM'] == null && admission['Externá_maturita_z_matematiky_EM'] == null && admission['Externá_maturita_z_cudzieho_jazyka_ECJ'] == null
      })
    }

    return admissions.filter(admission => {
      if(admission[type] == null)
        return false
      return Number(admission[type]) >= value
    })
  }

  /**
   * Filtrovanie podľa stupňa štúdia, na ktoré sa uchádzač uchádzal
   * @param admissions - všetky prihlášky, ktoré ideme filtrovať
   * @param value - hodnota, podľa ktorej ideme filtrovať (stupeň stúdia Bakalársky/Inžiniersky)
   */
  filterByDegree(admissions, value) {
    return admissions.filter(admission => admission.stupen_studia == value)
  }

  /**
   * Filtrovanie škôl podľa kódu školy - škola sa musí začínať na uvedenú postupnosť znakov
   * @param schools - všetky školy, ktoré ideme filtrovať
   * @param value - kód školy, respektíve postupnosť znakov
   */
  filterSchoolsBySchoolId(schools, value) {
    return schools.filter(school => String(school.kod_kodsko).startsWith(value))
  }

  /**
   * Filtrovanie podľa názvu ulice
   * @param schools  - všetky školy, ktoré ideme filtrovať
   * @param value  - ulica, respektíve podreťazec ulice
   */
  filterSchoolsByStreet(schools, value) {
    return schools.filter(school => school.ulica.indexOf(value) > -1)
  }

  /**
   * Funkcia, ktorá vyfiltruje len zahraničných študentov, t.j. takých, čo nemajú slovenské občianstvo.
   * @param admissions  - všetky prihlášky, ktoré ideme filtrovať
   */
  filterAbroadStudents(admissions) {
    return admissions.filter(admission => admission['Občianstvo'] !== 'Slovenská republika')
  }
 }

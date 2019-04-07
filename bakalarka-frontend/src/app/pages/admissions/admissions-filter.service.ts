import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AdmissionsFilterService {

  constructor() {}

  filterBySchoolType(admissions, value) {
    if(value == 'gymnasium')
      return admissions.filter(admission => ['Gymnázium', 'Športové gymnázium'].indexOf(admission.typ_skoly) > -1)
    else if(value == 'technical')
      return admissions.filter(admission => admission.typ_skoly == 'Stredná odborná škola')
    else if(value == 'other')
      return admissions.filter(admission => ['Gymnázium', 'Športové gymnázium', 'Stredná odborná škola'].indexOf(admission.typ_skoly) == -1)
  }

  filterByStudyType(admissions, value) {
    if(value == 4)
      return admissions.filter(admission => admission.Program_1[admission.Program_1.length - 1] == "4")
    else
      return admissions.filter(admission => admission.Program_1[admission.Program_1.length - 1] !== "4")
  }

  filterByGender(admissions, value) {
    return admissions.filter(admission => admission.Pohlavie == value)
  }

  filterByGraduationYear(admissions, value) {
    if(!value || value == 'all')
      return admissions

    return admissions.filter(admission => admission.Maturita_1 == value)
  }

  filterBySchoolQuality(admissions) {
    // todo

    return admissions
  }

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

  filterSchoolsBySchoolId(schools, schoolId) {
    return schools.filter(school => String(school.kod_kodsko).startsWith(schoolId))
  }
 }

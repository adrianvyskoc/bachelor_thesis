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
    return admissions.filter(admission => admission.Program_1.substr(admission.Program_1.length - 1) == value)
  }

  filterByGender(admissions, value) {
    return admissions.filter(admission => admission.Pohlavie == value)
  }

  filterBySchoolQuality(admissions) {
    // todo

    return admissions
  }
 }

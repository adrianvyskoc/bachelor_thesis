import { Component, Input, OnChanges } from '@angular/core';
import { AdmissionsFilterService } from '../../admissions-filter.service';

@Component({
  selector: 'app-schools-overview',
  templateUrl: './schools-overview.component.html',
  styleUrls: ['./schools-overview.component.scss']
})
export class SchoolsOverviewComponent implements OnChanges {

  @Input() schools = []

  filteredSchools = []
  chosenSchool
  schoolsToShow: string = 'all'
  schoolQuality: string = 'all'

  filteredSchoolId
  filteredSchoolStreet

  constructor(
    private admissionsFilterService: AdmissionsFilterService
  ) { }

  ngOnChanges() {
    this.filterSchools()
  }

  /**
   * Funkcia, ktorá aplikuje filtrovanie na školy podľa zvolených kritérií
   */
   filterSchools() {
    if (this.schoolsToShow == 'all') {
      this.filteredSchools = this.schools
    } else if (this.schoolsToShow == 'some') {
      this.filteredSchools = this.schools.filter(school => school.admissions.length)
    } else {
      this.filteredSchools = this.schools.filter(school => !school.admissions.length)
    }

    if (this.schoolQuality == 'all') {

    } else if (this.schoolQuality == 'high') {
      this.filteredSchools = this.filteredSchools.filter(school => school.celkove_hodnotenie > 5.9)
    } else if (this.schoolQuality == 'medium') {
      this.filteredSchools = this.filteredSchools.filter(school => school.celkove_hodnotenie <= 5.9 && school.celkove_hodnotenie > 3.9)
    } else if (this.schoolQuality == 'low') {
      this.filteredSchools = this.filteredSchools.filter(school => school.celkove_hodnotenie && school.celkove_hodnotenie <= 3.9)
    } else if (this.schoolQuality == 'none') {
      this.filteredSchools = this.filteredSchools.filter(school => !school.celkove_hodnotenie)
    }

    this.chosenSchool = null
  }

  onFilterSchoolsBySchoolId() {
    if(this.filteredSchoolId == "")
      this.filteredSchools = this.schools
    else
      this.filteredSchools = this.admissionsFilterService.filterSchoolsBySchoolId(this.filteredSchools, this.filteredSchoolId)
  }

  onFilterSchoolsByStreet() {
    if(this.filteredSchoolStreet == "")
      this.filteredSchools = this.schools
    else
      this.filteredSchools = this.admissionsFilterService.filterSchoolsByStreet(this.filteredSchools, this.filteredSchoolStreet)
  }

}

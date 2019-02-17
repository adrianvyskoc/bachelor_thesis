import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { AdmissionsFilterService } from './admissions-filter.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  subscription: Subscription

  admissions = []
  filteredAdmissions = []
  schools = []
  filteredSchools = []

  chosenSchool
  schoolsToShow: string = 'all'
  schoolQuality: string = 'all'

  // FILTER PROPERTIES
  filterForm: FormGroup

  constructor(
    private dataService: DataService,
    private admissionsFilterService: AdmissionsFilterService
  ) { }

  ngOnInit() {
    this.filterForm = new FormGroup({
      'studyType': new FormControl('all'),
      'schoolType': new FormControl('all'),
      'gender': new FormControl('all')
    })

    this.dataService.loadAdmissionsOverview()
    this.dataService.getAdmissionsOverviewUpdateListener()
      .subscribe(
        (data) => {
          this.schools = data['schools']
          this.admissions = data['admissions']
          this.filteredAdmissions = data['admissions']
          this._getSchoolsAdmissions()
          this.filterSchools()
        }
      )
  }

  // GENERAL FILTERING

  onFilter() {
    console.log(this.filterForm.value)
    this.filteredAdmissions = this.admissions

    if(this.filterForm.value.studyType !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterByStudyType(this.filteredAdmissions, this.filterForm.value.studyType)

    if(this.filterForm.value.schoolType !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterBySchoolType(this.filteredAdmissions, this.filterForm.value.schoolType)

    if(this.filterForm.value.gender !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterByGender(this.filteredAdmissions, this.filterForm.value.gender)

    this._getSchoolsAdmissions()
    this.filterSchools()
  }

  // SCHOOL MAP FILTERING

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

  _getSchoolsAdmissions() {
    this.schools = this.schools.map((school) => {
      school.approved = 0
      school.rejected = 0
      school.admissions = this.filteredAdmissions.reduce((acc, nextVal) => {
        if(nextVal.school_id == school.kod_kodsko) {
          acc.push(nextVal)
          nextVal.Rozh != 45 ? school.approved++ : school.rejected++
        }
        return acc
      }, [])

      return school
    })
  }
}

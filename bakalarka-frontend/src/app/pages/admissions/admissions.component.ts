import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  subscription: Subscription

  admissions = []
  schools = []
  filteredSchools = []

  chosenSchool
  schoolsToShow: string = 'all'
  schoolQuality: string = 'all'

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.loadAdmissionsOverview()
    this.dataService.getAdmissionsOverviewUpdateListener()
      .subscribe(
        (data) => {
          this.schools = data['schools']
          this.admissions = data['admissions']
          this._getSchoolsAdmissions()
          this.filterSchools()
        }
      )
  }

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
      school.admissions = this.admissions.reduce((acc, nextVal) => {
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

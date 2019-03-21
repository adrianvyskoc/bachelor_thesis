import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { AdmissionsFilterService } from './admissions-filter.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  subscription: Subscription

  admissions = []
  filteredAdmissions = []
  schools = []
  filteredSchools = []

  chosenSchool
  displayedAdmissionsColumns = ['id', 'Meno', 'Priezvisko', 'E_mail']
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
      'gender': new FormControl('all'),
      'pointsType': new FormControl('all'),
      'pointsValue': new FormControl(50)
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
    this.filteredAdmissions = this.admissions

    if(this.filterForm.value.studyType !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterByStudyType(this.filteredAdmissions, this.filterForm.value.studyType)

    if(this.filterForm.value.schoolType !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterBySchoolType(this.filteredAdmissions, this.filterForm.value.schoolType)

    if(this.filterForm.value.gender !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterByGender(this.filteredAdmissions, this.filterForm.value.gender)

    if(this.filterForm.value.pointsType !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterByPoints(this.filteredAdmissions, this.filterForm.value.pointsValue, this.filterForm.value.pointsType)


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

  onSchoolChoose(event) {
    this.chosenSchool = event
    this.chosenSchool.admissions = new MatTableDataSource<any[]>(this.chosenSchool.admissions)
    this.chosenSchool.admissions.paginator = this.paginator
    this.chosenSchool.admissions.sort = this.sort
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

  _displayedColumnsAndActions() {
    return [...this.displayedAdmissionsColumns, 'Akcie']
  }
}

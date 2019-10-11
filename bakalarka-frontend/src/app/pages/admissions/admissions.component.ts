import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { AdmissionsFilterService } from './admissions-filter.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { Title } from '@angular/platform-browser';
import { AdmissionsUtil } from './admissions.util';

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
  regionMetrics = {}

  // charts data
  admissionCounts = {}



  loading: boolean = true

  // FILTER PROPERTIES
  filterForm: FormGroup

  constructor(
    private dataService: DataService,
    private admissionsFilterService: AdmissionsFilterService,
    private tocUtil: TocUtil,
    private titleService: Title,
    private admissionsUtil: AdmissionsUtil
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Prijímacie konanie - Všeobecné")
    this.tocUtil.createToc()
    this.filterForm = new FormGroup({
      'degree': new FormControl('all'),
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
          this.loading = false
          this.regionMetrics = data['regionMetrics']
          this.schools = data['schools']
          this.admissions = data['admissions']
          this.filteredAdmissions = data['admissions']
          this._getSchoolsAdmissions()
          this._calculateAdmissionsCounts()
        }
      )
  }

  /**
   * Funkcia, ktorá aplikuje filtrovanie na prihlášky podľa zvolených kritérií
   */
  onFilter() {
    this.filteredAdmissions = this.admissions

    if(this.filterForm.value.degree !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterByDegree(this.filteredAdmissions, this.filterForm.value.degree)

    if(this.filterForm.value.studyType !== 'all' && this.filterForm.value.degree !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterByStudyType(this.filteredAdmissions, this.filterForm.value.studyType)

    if(this.filterForm.value.degree == 'Bakalársky') {
      if(this.filterForm.value.schoolType !== 'all')
        this.filteredAdmissions = this.admissionsFilterService.filterBySchoolType(this.filteredAdmissions, this.filterForm.value.schoolType)

      if(this.filterForm.value.pointsType !== 'all')
        this.filteredAdmissions = this.admissionsFilterService.filterByPoints(this.filteredAdmissions, this.filterForm.value.pointsValue, this.filterForm.value.pointsType)
    }

    if(this.filterForm.value.gender !== 'all')
      this.filteredAdmissions = this.admissionsFilterService.filterByGender(this.filteredAdmissions, this.filterForm.value.gender)

    this._getSchoolsAdmissions()
    this._calculateAdmissionsCounts()
  }

  _getSchoolsAdmissions() {
    this.schools = this.schools.map((school) => {
      school.approved = 0
      school.rejected = 0
      school.beganStudy = 0
      school.admissions = this.filteredAdmissions.reduce((acc, nextVal) => {
        if(nextVal.school_id == school.kod_kodsko) {
          acc.push(nextVal)
          nextVal.Rozh == 10 || nextVal.Rozh == 11 || nextVal.Rozh == 13 ? school.approved++ : school.rejected++
          if((nextVal.Rozh == 10 || nextVal.Rozh == 11 || nextVal.Rozh == 13) && nextVal['Štúdium'] == 'áno')
            school.beganStudy++
        }
        return acc
      }, [])

      return school
    })
  }

  _calculateAdmissionsCounts() {
    this.admissionCounts = this.filteredAdmissions.reduce((acc, admission) => {
      admission.stupen_studia == "Bakalársky" ? acc.bachelor++ : acc.master++
      if(admission.Rozh == 10 || admission.Rozh == 11 || admission.Rozh == 13) {
        if(admission['Štúdium'] == 'áno')
          acc.beganStudy++
        acc.approved++
      } else
        acc.rejected++
      return acc
    }, {'bachelor': 0, 'master': 0, 'approved': 0, 'rejected': 0, 'beganStudy': 0})
  }
}

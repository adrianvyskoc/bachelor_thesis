import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { AdmissionsFilterService } from './admissions-filter.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { Title } from '@angular/platform-browser';
import { AdmissionsUtil } from './admissions.util';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  @ViewChild('paginator', {static: false})
  set setPaginator(paginator: MatPaginator) {
    if(this.chosenSchool)
      this.chosenSchool.admissions.paginator = paginator
  }

  @ViewChild(MatSort, {static: false}) sort: MatSort

  subscription: Subscription

  admissions = []
  filteredAdmissions = []
  schools = []
  filteredSchools = []

  // zahraničné prihlášky a ich počty
  abroadAdmissions = {}

    // data pre graf
    abroadAdmissionsLabels = []
    abroadAdmissionsChartDatasets = []

  regionMetrics = {}

  filteredSchoolId
  filteredSchoolStreet

  // charts data
  admissionCounts = {}
  chartsLoaded = false

  chosenSchool
  displayedAdmissionsColumns = ['id', 'Meno', 'Priezvisko', 'E_mail', 'Program_1']
  schoolsToShow: string = 'all'
  schoolQuality: string = 'all'

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
          this.abroadAdmissions = this.admissionsUtil._calculateAbroadStudents(this.filteredAdmissions)
          this.filterSchools()
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

    this.abroadAdmissions = this.admissionsUtil._calculateAbroadStudents(this.filteredAdmissions)
    this._getSchoolsAdmissions()
    this._calculateAdmissionsCounts()
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

  onSchoolChoose(event) {
    this.chosenSchool = {}
    this.chosenSchool = event
    this.chosenSchool.admissions = new MatTableDataSource<any[]>(event.admissions.data ? event.admissions.data : event.admissions)
    this.chosenSchool.admissions.sort = this.sort
  }

  closeChosenSchoolWindow() {
    this.chosenSchool = null
  }

  isAccepted(rozh) {
    if(rozh == 10 || rozh == 11 || rozh == 13) {
      return "Prijatý"
    } else {
      return "Neprijatý"
    }
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

  _displayedColumnsAndActions() {
    return [...this.displayedAdmissionsColumns, 'Rozh', 'Akcie']
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

    setTimeout(() => {
      this.chartsLoaded = true
    }, 1000)
  }
}

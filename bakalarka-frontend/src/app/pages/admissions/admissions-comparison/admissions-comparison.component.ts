import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-admissions-comparison',
  templateUrl: './admissions-comparison.component.html',
  styleUrls: ['./admissions-comparison.component.scss']
})
export class AdmissionsComparisonComponent implements OnInit {

  admissions
  studyProgrammes = []
  schoolYears = []
  studyProgrammesMap = {}


  admCountsPerYear = {}
  admCountsPerYearArr = []

  admRatiosPerYear = {}
  admRatiosPerYearArr = []

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getAdmissionsYearComparison()
    this.dataService.getAdmissionsYearComparisonUpdateListener()
      .subscribe(data => {
        this.admissions = data['admissions']
        this.schoolYears = data['years']
        this.studyProgrammes = data['studyProgrammes']
        this.studyProgrammesMap = this._calculateCountsPerProgrammeForEachYear()
        this._adjustRatioCountsObject(data['ratios'])
      })
  }

  /*_calculateCountsForEachYear() {
    let admCountsPerYear = this.admissions.reduce((acc, admission) => {
      if(!acc[admission.OBDOBIE])
        acc[admission.OBDOBIE] = {}

      if(admission.Rozh != 45) {
        if(admission.Štúdium == 'áno')
          acc[admission.OBDOBIE].beganStudy = ++acc[admission.OBDOBIE].beganStudy || 1
        acc[admission.OBDOBIE].approved = ++acc[admission.OBDOBIE].approved || 1
      }
      else
        acc[admission.OBDOBIE].rejected = ++acc[admission.OBDOBIE].rejected || 1

      return acc
    }, {})

    this.admCountsPerYear = Object.keys(admCountsPerYear).reduce((acc, nextVal) => {
      return [ [...acc[0], admCountsPerYear[nextVal].rejected], [...acc[1], admCountsPerYear[nextVal].approved], [...acc[2], admCountsPerYear[nextVal].beganStudy]]
    }, [[], [], []])
  }*/

  _calculateCountsPerProgrammeForEachYear() {
    let programmesMap = this.studyProgrammes.reduce((acc, programme) => {
      acc[programme] = {}
      return acc
    }, {})

    this.admissions.forEach(admission => {
      programmesMap[admission.Program_1][admission.OBDOBIE] = ++programmesMap[admission.Program_1][admission.OBDOBIE] || 1
    })

    return programmesMap
  }

  _adjustRatioCountsObject(ratioCounts) {
    let approvedMap = ratioCounts['approved'].reduce((acc, nextVal) => {
      acc[nextVal.OBDOBIE] = nextVal.apr
      return acc
    }, {})

    let beganStudyMap = ratioCounts['began_study'].reduce((acc, nextVal) => {
      acc[nextVal.OBDOBIE] = nextVal.bs
      return acc
    }, {})

    this.admCountsPerYear = this.schoolYears.reduce((acc, year) => {
      acc[year] = {}
      acc[year].approved = approvedMap[year]
      acc[year].beganStudy = beganStudyMap[year]
      return acc
    }, {})

    this.admCountsPerYearArr = Object.keys(this.admCountsPerYear).reduce((acc, year) => {
      this.admRatiosPerYear[year] = ((this.admCountsPerYear[year].beganStudy / this.admCountsPerYear[year].approved) * 100).toFixed(2)
      return [ [...acc[0], this.admCountsPerYear[year].approved], [...acc[1], this.admCountsPerYear[year].beganStudy]]
    }, [[], []])

    this.admRatiosPerYearArr = Object.values(this.admRatiosPerYear)
  }
}

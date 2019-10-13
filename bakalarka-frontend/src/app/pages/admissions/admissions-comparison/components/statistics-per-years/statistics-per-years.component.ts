import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-statistics-per-years',
  templateUrl: './statistics-per-years.component.html',
  styleUrls: ['./statistics-per-years.component.scss']
})
export class StatisticsPerYearsComponent implements OnChanges {

  @Input() schoolYears = []
  @Input() lastNYears: number
  @Input() adm

  admCountsAndRatios = {}

  constructor() { }

  ngOnChanges() {
    if(this.adm)
      this.admCountsAndRatios = this._adjustRatioCountsObject()
  }

  _adjustRatioCountsObject() {

    let approvedMap = this.adm['approved'].reduce((acc, nextVal) => {
      acc[nextVal.OBDOBIE] = {}
      acc[nextVal.OBDOBIE].apr = nextVal.apr
      acc[nextVal.OBDOBIE].mean = Number(nextVal.mean).toFixed(2)
      acc[nextVal.OBDOBIE].median = nextVal.median
      return acc
    }, {})

    let beganStudyMap = this.adm['began_study'].reduce((acc, nextVal) => {
      acc[nextVal.OBDOBIE] = {}
      acc[nextVal.OBDOBIE].bs = nextVal.bs
      acc[nextVal.OBDOBIE].mean = Number(nextVal.mean).toFixed(2)
      acc[nextVal.OBDOBIE].median = nextVal.median
      return acc
    }, {})

    let admCountsPerYear = this.schoolYears.reduce((acc, year) => {
      acc[year] = {}
      acc[year].approved = approvedMap[year].apr
      acc[year].beganStudy = beganStudyMap[year].bs
      return acc
    }, {})

    let admRatiosPerYear = {}, admRatiosPerYearArr = []
    let admCountsPerYearArr = Object.keys(admCountsPerYear).reduce((acc, year) => {
      admRatiosPerYear[year] = ((admCountsPerYear[year].beganStudy / admCountsPerYear[year].approved) * 100).toFixed(2)
      return [ [...acc[0], admCountsPerYear[year].approved], [...acc[1], admCountsPerYear[year].beganStudy]]
    }, [[], []])

    admRatiosPerYearArr = Object.values(admRatiosPerYear)

    return { admRatiosPerYear, admRatiosPerYearArr, admCountsPerYear, admCountsPerYearArr, beganStudyMap, approvedMap }
  }

}

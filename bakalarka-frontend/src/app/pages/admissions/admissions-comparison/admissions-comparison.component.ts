import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admissions-comparison',
  templateUrl: './admissions-comparison.component.html',
  styleUrls: ['./admissions-comparison.component.scss']
})
export class AdmissionsComparisonComponent implements OnInit, OnDestroy {

  subscription: Subscription

  lastNYears: number

  admissions
  studyProgrammes = []
  schoolYears = []
  schoolYearsFiltered = []
  studyProgrammesMap = {}

  admCountsPerYear = {}
  admCountsPerYearArr = []
  admRatiosPerYear = {}
  admRatiosPerYearArr = []

  admBachelorCountsPerYear = {}
  admBachelorCountsPerYearArr = []
  admBachelorRatiosPerYear = {}
  admBachelorRatiosPerYearArr = []

  admMasterCountsPerYear = {}
  admMasterCountsPerYearArr = []
  admMasterRatiosPerYear = {}
  admMasterRatiosPerYearArr = []

  adm = {}
  admBachelor = {}
  admMaster = {}

  admFiltered = {}
  admBachelorFiltered = {}
  admMasterFiltered = {}

  constructor(
    private dataService: DataService,
    private tocUtil: TocUtil,
    private exportService: ExportService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Prijímacie konanie - Porovnanie")
    this.tocUtil.createToc()
    this.dataService.getAdmissionsYearComparison()
    this.subscription =  this.dataService.getAdmissionsYearComparisonUpdateListener()
      .subscribe(data => {
        this.admissions = data['admissions']
        this.schoolYears = data['years']
        this.schoolYearsFiltered = data['years']
        this.studyProgrammes = data['studyProgrammes']
        this.studyProgrammesMap = this._calculateCountsPerProgrammeForEachYear()
        this.adm = data['ratios']
        this.admBachelor = data['bachelorRatios']
        this.admMaster = data['masterRatios']
        this.loadYearsData()
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  loadYearsData() {
    this.admFiltered = this._adjustRatioCountsObject(this.adm)
    this.admBachelorFiltered = this._adjustRatioCountsObject(this.admBachelor)
    this.admMasterFiltered = this._adjustRatioCountsObject(this.admMaster)
  }

  exportAllTables() {
    const tables = document.querySelectorAll("table:not([mat-table])")

    this.exportService.exportMultipleTablesToExcel(tables, 'admissions-comparison')
  }

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
    // vyfiltrovat len roky za počet zvolených rokov, ak nejaký počet je zadaný
    if(this.lastNYears) {
      ratioCounts = {
        approved: ratioCounts['approved'].slice(ratioCounts['approved'].length - this.lastNYears),
        began_study: ratioCounts['began_study'].slice(ratioCounts['began_study'].length- this.lastNYears)
      }
      this.schoolYearsFiltered = this.schoolYears.slice(this.schoolYears.length - this.lastNYears)
    } else
      this.schoolYearsFiltered = this.schoolYears

    let approvedMap = ratioCounts['approved'].reduce((acc, nextVal) => {
      acc[nextVal.OBDOBIE] = {}
      acc[nextVal.OBDOBIE].apr = nextVal.apr
      acc[nextVal.OBDOBIE].mean = Number(nextVal.mean).toFixed(2)
      acc[nextVal.OBDOBIE].median = nextVal.median
      return acc
    }, {})

    let beganStudyMap = ratioCounts['began_study'].reduce((acc, nextVal) => {
      acc[nextVal.OBDOBIE] = {}
      acc[nextVal.OBDOBIE].bs = nextVal.bs
      acc[nextVal.OBDOBIE].mean = Number(nextVal.mean).toFixed(2)
      acc[nextVal.OBDOBIE].median = nextVal.median
      return acc
    }, {})

    let admCountsPerYear = this.schoolYearsFiltered.reduce((acc, year) => {
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

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { Title } from '@angular/platform-browser';

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
    this.dataService.getAdmissionsYearComparisonUpdateListener()
      .subscribe(data => {
        this.admissions = data['admissions']
        this.schoolYears = data['years']
        this.studyProgrammes = data['studyProgrammes']
        this.studyProgrammesMap = this._calculateCountsPerProgrammeForEachYear()
        this.adm = this._adjustRatioCountsObject(data['ratios'])
        this.admBachelor = this._adjustRatioCountsObject(data['bachelorRatios'])
        this.admMaster = this._adjustRatioCountsObject(data['masterRatios'])
      })
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
    let approvedMap = ratioCounts['approved'].reduce((acc, nextVal) => {
      acc[nextVal.OBDOBIE] = nextVal.apr
      return acc
    }, {})

    let beganStudyMap = ratioCounts['began_study'].reduce((acc, nextVal) => {
      acc[nextVal.OBDOBIE] = nextVal.bs
      return acc
    }, {})

    let admCountsPerYear = this.schoolYears.reduce((acc, year) => {
      acc[year] = {}
      acc[year].approved = approvedMap[year]
      acc[year].beganStudy = beganStudyMap[year]
      return acc
    }, {})

    let admRatiosPerYear = {}, admRatiosPerYearArr = []
    let admCountsPerYearArr = Object.keys(admCountsPerYear).reduce((acc, year) => {
      admRatiosPerYear[year] = ((admCountsPerYear[year].beganStudy / admCountsPerYear[year].approved) * 100).toFixed(2)
      return [ [...acc[0], admCountsPerYear[year].approved], [...acc[1], admCountsPerYear[year].beganStudy]]
    }, [[], []])

    admRatiosPerYearArr = Object.values(admRatiosPerYear)

    return { admRatiosPerYear, admRatiosPerYearArr, admCountsPerYear, admCountsPerYearArr }
  }
}

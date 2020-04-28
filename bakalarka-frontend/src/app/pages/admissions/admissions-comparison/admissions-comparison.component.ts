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

  adm
  admBachelor
  admMaster

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
      })
      
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  exportAllTables() {
    const tables = document.querySelectorAll("table:not([mat-table])")

    this.exportService.exportMultipleTablesToExcel(tables, 'admissions-comparison')
  }

  onlastNYearsChange() {
    this.schoolYearsFiltered = this.lastNYears
      ? this.schoolYears.slice(this.schoolYears.length - this.lastNYears)
      : this.schoolYears
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
}

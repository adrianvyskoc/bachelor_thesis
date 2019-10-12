import { Component, Input, OnChanges } from '@angular/core';
import { AdmissionsUtil } from '../../../../admissions.util';
import { AdmissionsFilterService } from '../../../../admissions-filter.service';

@Component({
  selector: 'app-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss']
})
export class StatisticsTableComponent implements OnChanges {

  @Input() attributesToShow = []
  @Input() data = []
  @Input() numberOfGroups = 10
  @Input() intervalsUpperLimits = [40, 50, 60, 70, 80, 90, 100]
  @Input() type

  groups = []
  intervals = {}
  summary = {}

  filtered = []

  graduationYear: number
  studyLength = 'all'

  // table header
  header = []

  constructor(
    private AdmissionsUtil: AdmissionsUtil,
    private admissionsFilterService: AdmissionsFilterService
  ) { }

  ngOnChanges() {
    this.filtered = this.data
    this._calculateData()
  }

  onFilter() {
    this.filtered = this.data

    if(this.graduationYear)
      this.filtered = this.admissionsFilterService.filterByGraduationYear(this.filtered, this.graduationYear)
    if(this.studyLength !== 'all')
      this.filtered = this.admissionsFilterService.filterByStudyType(this.filtered, this.studyLength)
    this._calculateData()
  }

  _calculateData() {
    if(this.type == 'groups') {
      this.groups = this.AdmissionsUtil._calculateGroups(this.filtered, this.numberOfGroups)
      this.summary = this.AdmissionsUtil._calculateSummary(this.groups)
      this.header = ['#', 'Kvantita', 'Nastúpil', 'Nastúpil (%)', 'Rozpätie bodov', 'Priemer bodov', 'Medián']
    } else {
      this.intervals = this.AdmissionsUtil._calculateIntervals(this.filtered, this.intervalsUpperLimits)
      this.header = ['Decibely', 'Kvantita', 'Nastúpil', 'Nastúpil (%)']
    }
  }
}

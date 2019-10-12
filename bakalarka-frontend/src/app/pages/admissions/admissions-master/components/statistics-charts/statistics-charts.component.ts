import { Component, Input, OnChanges } from '@angular/core';
import { AdmissionsUtil } from '../../../admissions.util';

@Component({
  selector: 'app-statistics-charts',
  templateUrl: './statistics-charts.component.html',
  styleUrls: ['./statistics-charts.component.scss']
})
export class StatisticsChartsComponent implements OnChanges {

  @Input() admissions = []

  admissionsTimes = []
  admissionsPerDay = []

  constructor(
    private admissionsUtil: AdmissionsUtil
  ) { }

  ngOnChanges() {
    this.admissionsTimes = this.admissionsUtil._getAdmissionsDates(this.admissions)
    this.admissionsPerDay = this.admissionsUtil._getAdmissionsPerDay(this.admissions)
  }

}

import { Component, Input, OnChanges } from '@angular/core';
import { AdmissionsUtil } from '../../../admissions.util';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnChanges {

  @Input() admissions = []

  admissionsTimes = []
  admissionsPerDay = []

  graduationYear: number
  numberOfGroups: number = 10

  constructor(
    private admissionsUtil: AdmissionsUtil
  ) { }

  ngOnChanges() {
    this.admissionsTimes = this.admissionsUtil._getAdmissionsDates(this.admissions)
    this.admissionsPerDay = this.admissionsUtil._getAdmissionsPerDay(this.admissions)
  }

}

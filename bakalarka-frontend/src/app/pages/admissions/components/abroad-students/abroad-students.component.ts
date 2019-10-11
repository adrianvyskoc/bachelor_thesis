import { Component, Input, OnChanges } from '@angular/core';
import { AdmissionsUtil } from '../../admissions.util';

@Component({
  selector: 'app-abroad-students',
  templateUrl: './abroad-students.component.html',
  styleUrls: ['./abroad-students.component.scss']
})
export class AbroadStudentsComponent implements OnChanges {

  @Input() admissions = []

  // zahraničné prihlášky a ich počty
  abroadAdmissions = {}

  // data pre graf
  abroadAdmissionsLabels = []
  abroadAdmissionsChartDatasets = []

  constructor(
    private admissionsUtil: AdmissionsUtil
  ) { }

  ngOnChanges() {
    this.abroadAdmissions = this.admissionsUtil._calculateAbroadStudents(this.admissions)
  }

}

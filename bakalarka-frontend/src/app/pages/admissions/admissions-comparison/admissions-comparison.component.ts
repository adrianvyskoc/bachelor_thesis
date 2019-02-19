import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-admissions-comparison',
  templateUrl: './admissions-comparison.component.html',
  styleUrls: ['./admissions-comparison.component.scss']
})
export class AdmissionsComparisonComponent implements OnInit {

  admissions
  admCountsPerYear = {}

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getData('Admissions')
    this.dataService.getAdmissionsUpdateListener()
      .subscribe(admissions => {
        this.admissions = admissions
        this._calculateCountsForEachYear()
      })
  }

  _calculateCountsForEachYear() {
    let admCountsPerYear = this.admissions.reduce((acc, admission) => {
      if(!acc[admission.OBDOBIE])
        acc[admission.OBDOBIE] = {}

      if(admission.Rozh != 45)
        acc[admission.OBDOBIE].approved = ++acc[admission.OBDOBIE].approved || 0
      else
        acc[admission.OBDOBIE].rejected = ++acc[admission.OBDOBIE].rejected || 0

      return acc
    }, {})

    this.admCountsPerYear = Object.keys(admCountsPerYear).reduce((acc, nextVal) => {
      return [ [...acc[0], admCountsPerYear[nextVal].rejected ], [...acc[1], admCountsPerYear[nextVal].approved ] ]
    }, [[], []])
  }
}

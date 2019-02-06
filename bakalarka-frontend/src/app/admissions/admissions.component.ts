import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  subscription: Subscription

  admissions = []
  schools = []

  chosenSchool

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getData('Admissions')
    this.subscription = this.dataService.getAdmissionsUpdateListener()
      .subscribe(
        (admissions:any[]) => {
          this.admissions = admissions
        }
      )

    this.dataService.getData('Schools')
    this.dataService.getSchoolsUpdateListener()
      .subscribe(
        (schools: any[]) => {
          this.schools = schools
        }
      )

  }

  onSelectedMarker(event) {
    this.chosenSchool = event
    this.chosenSchool.rejected = 0
    this.chosenSchool.approved = 0
    this.chosenSchool.admissions = this.admissions.reduce((acc, nextVal) => {
      if(nextVal.school_id == this.chosenSchool.kod_kodsko) {
        acc.push(nextVal)
        nextVal.Rozh != 45 ? this.chosenSchool.approved++ : this.chosenSchool.rejected++
      }
      return acc
    }, [])
  }
}

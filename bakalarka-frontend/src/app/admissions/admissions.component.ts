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

  admissions
  schools

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getData('Admissions')
    this.subscription = this.dataService.getAdmissionsUpdateListener()
      .subscribe(
        (admissions:any[]) => {
          console.log(admissions)
          this.admissions = admissions
        }
      )

    this.dataService.getData('Schools')
    this.dataService.getSchoolsUpdateListener()
      .subscribe(
        (schools: any[]) => {
          console.log(schools)
          this.schools = schools
        }
      )
  }
}

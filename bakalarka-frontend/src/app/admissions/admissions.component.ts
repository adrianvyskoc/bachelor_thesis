import { Component, OnInit } from '@angular/core';
import { AdmissionsService } from './admissions.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.scss']
})
export class AdmissionsComponent implements OnInit {
  subscription: Subscription

  admissions

  constructor(
    private admissionsService: AdmissionsService
  ) { }

  ngOnInit() {
    this.admissionsService.getAdmissions()
    this.subscription = this.admissionsService.getAdmissionsUpdateListener()
      .subscribe(
        (admissions:any[]) => {
          this.admissions = admissions
        }
      )
  }

}

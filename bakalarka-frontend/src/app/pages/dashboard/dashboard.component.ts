import { Component, OnInit } from '@angular/core'
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  schoolsData:{raw: any, sos: any, gym: any, konz: any, ssp: any} = { raw: [], sos: [], gym: [], konz: [], ssp: [] }
  admissionsData:{raw: any, info: any, info4: any, pkss: any, pkss4: any} = { raw: [], info: [], info4: [], pkss: [], pkss4: [] }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData('Schools')
    this.dataService.getSchoolsUpdateListener()
      .subscribe(schoolsData => {
        this.schoolsData.raw = schoolsData
        this.schoolsData.sos = this.schoolsData.raw.filter(school => school.typ_skoly == 'Stredná odborná škola')
        this.schoolsData.gym = this.schoolsData.raw.filter(school => school.typ_skoly == 'Gymnázium')
        this.schoolsData.konz = this.schoolsData.raw.filter(school => school.typ_skoly == 'Konzervatórium')
        this.schoolsData.ssp = this.schoolsData.raw.filter(school => school.typ_skoly == 'Špeciálna stredná škola')
      })

    this.dataService.getData('Admissions')
    this.dataService.getAdmissionsUpdateListener()
      .subscribe(admissionsData => {
        this.admissionsData.raw = admissionsData
        this.admissionsData.info = this.admissionsData.raw.filter(admission => admission.Program_1 == 'B-INFO')
        this.admissionsData.info4 = this.admissionsData.raw.filter(admission => admission.Program_1 == 'B-INFO4')
        this.admissionsData.pkss = this.admissionsData.raw.filter(admission => admission.Program_1 == 'B-PKSS')
        this.admissionsData.pkss4 = this.admissionsData.raw.filter(admission => admission.Program_1 == 'B-PKSS4')
      })
    }
}

import { Component, OnInit } from '@angular/core';
import { AdmissionsManagementService } from './admissions-management.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admissions-management',
  templateUrl: './admissions-management.component.html',
  styleUrls: ['./admissions-management.component.scss']
})
export class AdmissionsManagementComponent implements OnInit {

  surname: string
  admissions = []
  showNotification = false
  message
  success
  chosenAdmission

  constructor(
    private AdmissionsManagementService: AdmissionsManagementService
  ) { }

  ngOnInit() {

  }

  onAdmissionSearch() {
    this.AdmissionsManagementService.getAdmissionsByName(this.surname)
      .subscribe((admissions:any) => this.admissions = admissions.admissions)
  }

  onAdmissionUpdate(admission) {
    this.chosenAdmission = admission
  }

  onAdmissionDelete(id) {
    this.AdmissionsManagementService.deleteAdmission(id)
      .subscribe((resp) => {
        this.showNotification = true
        this.success = resp['success']
        this.message = resp['message']

        if(this.success)
          this.chosenAdmission = null

        this.onAdmissionSearch()

        setTimeout(() => {
          this.showNotification = false
        }, 5000)
      })
  }

  onUpdate(form: NgForm) {
    this.AdmissionsManagementService.updateAdmission(form.value)
      .subscribe((resp) => {
        console.log(resp)
      })
  }
}

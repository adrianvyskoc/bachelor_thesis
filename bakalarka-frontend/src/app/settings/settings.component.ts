import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  attendanceTypes = []
  newAttendanceType = false

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsService.getCodebookData('attendanceTypes')
    this.settingsService.getAttendanceTypesUpdateListener()
      .subscribe(
        (attendanceTypes:any[]) => {
          this.attendanceTypes = attendanceTypes
        }
      )      
  }

  onAttendanceTypeAdd(form: NgForm) {
    this.settingsService.createAttendanceType('attendanceTypes', form.value)
    this.newAttendanceType = false
  }

}

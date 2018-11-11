import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  attendanceTypes = [];

  newAttendanceType = false;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsService.getCodebookData('AttendanceTypes')
      .subscribe(
        (attendanceTypes: []) => {
          console.log(attendanceTypes);
          this.attendanceTypes = attendanceTypes;
        }
      );
  }

  onAttendanceTypeAdd(form: NgForm) {
    console.log(form);
    this.settingsService.createAttendanceType(form.value);
  }

}

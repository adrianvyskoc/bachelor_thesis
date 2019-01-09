import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  codebooks = []

  constructor() { }

  ngOnInit() {
    this.codebooks = [
      {
        title: 'Dochádzka',
        type: 'attendanceTypes'
      },
      {
        title: 'Typ strednej školy',
        type: 'highSchoolTypes'
      },
      {
        title: 'Typ štúdia',
        type: 'studyForms'
      },
    ]
  }

}

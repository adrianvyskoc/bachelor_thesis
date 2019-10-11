import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-students-origin',
  templateUrl: './students-origin.component.html',
  styleUrls: ['./students-origin.component.scss']
})
export class StudentsOriginComponent {

  @Input() admissions = []

  constructor() { }

}

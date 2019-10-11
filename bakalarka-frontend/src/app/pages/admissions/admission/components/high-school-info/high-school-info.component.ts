import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-high-school-info',
  templateUrl: './high-school-info.component.html',
  styleUrls: ['./high-school-info.component.scss']
})
export class HighSchoolInfoComponent {

  @Input() admission = {}
  @Input() school = {}
  @Input() pointers = {}

  constructor() { }

}

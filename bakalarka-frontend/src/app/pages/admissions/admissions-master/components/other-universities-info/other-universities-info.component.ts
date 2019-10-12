import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-other-universities-info',
  templateUrl: './other-universities-info.component.html',
  styleUrls: ['./other-universities-info.component.scss']
})
export class OtherUniversitiesInfoComponent {

  @Input() universities = []

  constructor() { }

}

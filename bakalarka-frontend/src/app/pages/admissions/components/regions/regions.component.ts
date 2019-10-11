import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent {

  @Input() admissions = []
  @Input() regionMetrics = {}

  constructor() { }

}

import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() singleMarker: boolean = false
  @Input() marker: {} = {}
  @Input() markers: [] = []
  @Input() height: number;

  lat: number = 47.76356
  lng: number = 17.02188
  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() singleMarker: boolean = false
  @Input() marker: {} = {}
  @Input() markers: [] = []
  @Input() height: number
  @Input() heatMap: boolean = false

  @Output() selectMarker = new EventEmitter()

  lat: number = 48.633
  lng: number = 19.467

  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;

  constructor() { }

  ngOnInit() {
  }

  onMapLoad(mapInstance: google.maps.Map) {
    if(!this.heatMap) return

    this.map = mapInstance
    const coords: google.maps.LatLng[] = this.markers.map(
      mrk => new google.maps.LatLng(mrk['sur_y'], mrk['sur_x'])
    )
    this.heatmap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        data: coords,
        radius: 50
    })
  }

  onSelectMarker(markerData) {
    this.selectMarker.emit(markerData)
  }
}

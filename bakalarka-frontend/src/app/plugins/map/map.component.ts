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

  lat: number = 48.633
  lng: number = 19.467

  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;

  constructor() { }

  ngOnInit() {
  }

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    // here our in other method after you get the coords; but make sure map is loaded

    const coords: google.maps.LatLng[] = this.markers; // can also be a google.maps.MVCArray with LatLng[] inside
    this.heatmap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        data: coords
    });
  }

}

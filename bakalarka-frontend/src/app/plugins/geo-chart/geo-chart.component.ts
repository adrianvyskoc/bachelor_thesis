import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-geo-chart',
  templateUrl: './geo-chart.component.html',
  styleUrls: ['./geo-chart.component.scss']
})
export class GeoChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    google.charts.load('current', {
      'packages':['geochart'],
      // Note: you will need to get a mapsApiKey for your project.
      // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
      'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
      callback: function () {
        new google.visualization.GeoChart(document.getElementById('regions_div')).draw(
          google.visualization.arrayToDataTable([
            ['Destination', 'Popularity'],
            ['SK-BL', 300],
            ['SK-TA', 100],
            ['SK-TC', 100],
            ['SK-NI', 100],
            ['SK-PV', 100],
            ['SK-ZI', 100],
            ['SK-KI', 100],
            ['SK-BC', 100],
          ]),
          {
            colorAxis: {colors: ['red', 'green']},
            displayMode: 'regions',
            region: 'SK',
            resolution: 'provinces'
          }
        );
      },
    });
    // https://sk.wikipedia.org/wiki/ISO_3166-2:SK
  }


}

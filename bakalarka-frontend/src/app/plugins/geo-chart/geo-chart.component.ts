import { Component, OnInit, Input } from '@angular/core'

// how to get region codes
// https://sk.wikipedia.org/wiki/ISO_3166-2:SK

@Component({
  selector: 'app-geo-chart',
  templateUrl: './geo-chart.component.html',
  styleUrls: ['./geo-chart.component.scss']
})
export class GeoChartComponent implements OnInit {
  @Input() data = []

  regionAdmissionCounts = {}

  constructor() { }

  ngOnInit() {
    this._calculateRegionAdmissionCounts()

    google['charts'].load('current', {
      'packages':['geochart'],
      'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
      callback: () => {
        new google['visualization'].GeoChart(document.getElementById('regions_div')).draw(
          google['visualization'].arrayToDataTable([
            ['Destination', 'Počet študentov'],
            ['SK-BL', this.regionAdmissionCounts['SK-BL']],
            ['SK-TA', this.regionAdmissionCounts['SK-TA']],
            ['SK-TC', this.regionAdmissionCounts['SK-TC']],
            ['SK-NI', this.regionAdmissionCounts['SK-NI']],
            ['SK-PV', this.regionAdmissionCounts['SK-PV']],
            ['SK-ZI', this.regionAdmissionCounts['SK-ZI']],
            ['SK-KI', this.regionAdmissionCounts['SK-KI']],
            ['SK-BC', this.regionAdmissionCounts['SK-BC']]
          ]),
          {
            colorAxis: {colors: ['red', 'green']},
            displayMode: 'regions',
            region: 'SK',
            resolution: 'provinces'
          }
        )
      },
    })
  }

  _calculateRegionAdmissionCounts() {
    const regions = {
      'Bratislavský': 'SK-BL',
      'Trnavský': 'SK-TA',
      'Trenčiansky': 'SK-TC',
      'Nitriansky': 'SK-NI',
      'Prešovský': 'SK-PV',
      'Žilinský': 'SK-ZI',
      'Košický': 'SK-KI',
      'Banskobystrický': 'SK-BC'
    }

    this.regionAdmissionCounts = this.data.reduce((acc, nextVal) => {
      acc[regions[nextVal.kraj] || 'notprovided'] = ++acc[regions[nextVal.kraj] || 'notprovided'] || 0
      return acc
    }, {})
  }
}

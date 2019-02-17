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
    console.log(this.regionAdmissionCounts)

    google['charts'].load('current', {
      'packages':['geochart'],
      'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
      callback: () => {
        new google['visualization'].GeoChart(document.getElementById('regions_div')).draw(
          google['visualization'].arrayToDataTable([
            ['Destination', 'Počet študentov', 'Pocet'],
            ['SK-BL', this.regionAdmissionCounts['SK-BL'], 100],
            ['SK-TA', this.regionAdmissionCounts['SK-TA'], 100],
            ['SK-TC', this.regionAdmissionCounts['SK-TC'], 100],
            ['SK-NI', this.regionAdmissionCounts['SK-NI'], 100],
            ['SK-PV', this.regionAdmissionCounts['SK-PV'], 100],
            ['SK-ZI', this.regionAdmissionCounts['SK-ZI'], 100],
            ['SK-KI', this.regionAdmissionCounts['SK-KI'], 100],
            ['SK-BC', this.regionAdmissionCounts['SK-BC'], 100]
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
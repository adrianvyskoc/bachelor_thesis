import { Component, Input, OnChanges } from '@angular/core'

// how to get region codes
// https://sk.wikipedia.org/wiki/ISO_3166-2:SK

@Component({
  selector: 'app-geo-chart',
  templateUrl: './geo-chart.component.html',
  styleUrls: ['./geo-chart.component.scss']
})
export class GeoChartComponent implements OnChanges {
  @Input() data = []

  regionAdmissionCounts = {}
  pointCounts = {}
  regionMedians = {}

  constructor() { }

  ngOnChanges() {
    this._initChart()
  }

  _initChart() {
    this._calculateRegionAdmissionCounts()

    google['charts'].load('current', {
      'packages':['geochart'],
      'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
      callback: () => {
        new google['visualization'].GeoChart(document.getElementById('regions_div')).draw(
          google['visualization'].arrayToDataTable([
            ['Destination', 'Počet študentov', 'Priemer bodov'],
            ['SK-BL', this.regionAdmissionCounts['SK-BL'], this.pointCounts['SK-BL'] / this.regionAdmissionCounts['SK-BL']],
            ['SK-TA', this.regionAdmissionCounts['SK-TA'], this.pointCounts['SK-TA'] / this.regionAdmissionCounts['SK-TA']],
            ['SK-TC', this.regionAdmissionCounts['SK-TC'], this.pointCounts['SK-TC'] / this.regionAdmissionCounts['SK-TC']],
            ['SK-NI', this.regionAdmissionCounts['SK-NI'], this.pointCounts['SK-NI'] / this.regionAdmissionCounts['SK-NI']],
            ['SK-PV', this.regionAdmissionCounts['SK-PV'], this.pointCounts['SK-PV'] / this.regionAdmissionCounts['SK-PV']],
            ['SK-ZI', this.regionAdmissionCounts['SK-ZI'], this.pointCounts['SK-ZI'] / this.regionAdmissionCounts['SK-ZI']],
            ['SK-KI', this.regionAdmissionCounts['SK-KI'], this.pointCounts['SK-KI'] / this.regionAdmissionCounts['SK-KI']],
            ['SK-BC', this.regionAdmissionCounts['SK-BC'], this.pointCounts['SK-BC'] / this.regionAdmissionCounts['SK-BC']]
          ]),
          {
            colorAxis: {colors: ['yellow', 'green']},
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
      acc[regions[nextVal.kraj] || 'notprovided'] = ++acc[regions[nextVal.kraj] || 'notprovided'] || 1
      return acc
    }, {})

    this.pointCounts = this.data.reduce((acc, nextVal) => {
      if(!acc[regions[nextVal.kraj] || 'notprovided'])
        acc[regions[nextVal.kraj] || 'notprovided'] = 0

      acc[regions[nextVal.kraj] || 'notprovided'] += Number(nextVal.Body_celkom)
      return acc
    }, {})

    this.regionMedians = this.data.reduce((acc, nextVal) => {
      if(!acc[regions[nextVal.kraj] || 'notprovided'])
        acc[regions[nextVal.kraj] || 'notprovided'] = [Number(nextVal.Body_celkom)]

      acc[regions[nextVal.kraj] || 'notprovided'].push(Number(nextVal.Body_celkom))
      return acc
    }, {})

    Object.keys(this.regionMedians).forEach(region => {
      this.regionMedians[region] = this._median(this.regionMedians[region])
    })
  }

  _median(values) {
      values.sort(function(a,b){
      return a-b;
    });

    if(values.length ===0) return 0

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
      return values[half];
    else
      return (values[half - 1] + values[half]) / 2.0;
  }
}

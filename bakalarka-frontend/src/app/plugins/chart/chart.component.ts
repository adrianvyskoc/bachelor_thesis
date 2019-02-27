import { Component, Input, ViewChild, SimpleChanges, SimpleChange, OnChanges } from '@angular/core'
import { Chart } from 'chart.js'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {
  @Input() type: string
  @Input() data: any[]
  @Input() title: string
  @Input() labels: string[]
  @Input() groupLabels: string[]
  @Input() legend: boolean
  @Input() saveButton: boolean = true

  @Input() group: boolean = false

  @ViewChild('canvas') canvas
  @ViewChild('download') download
  chart

  backgroundColors: string[] = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ]
  borderColors: string[] = [
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ]

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const data: SimpleChange = changes.data
    this.data = data.currentValue

    if(this.data.some(item => item)) this.initChart()
  }

  initChart() {
    this.chart = new Chart(this.canvas.nativeElement.getContext('2d'), {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: this._createDatasets()
      },
      options: {
        title: {
          display: !!this.title,
          text: this.title
        },
        legend: {
          display: this.legend,
          labels: {
              fontColor: 'rgb(255, 99, 132)'
          }
        },
        animation: {
          onComplete: () => {
            this.download.nativeElement.href = this.chart.toBase64Image();
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  }

  _createDatasets() {
    if(this.group) {

      return this.data.reduce((acc, nextVal, idx) => {
        acc.push({
          data: nextVal,
          label: this.groupLabels[idx],
          backgroundColor: this.backgroundColors[idx],
          borderColor: this.borderColors[idx],
          borderWidth: 1,
        })
        return acc
      }, [])

    } else {

      return [{
        data: this.data,
        backgroundColor: this.backgroundColors.slice(0, this.data.length),
        borderColor: this.borderColors.slice(0, this.data.length),
        borderWidth: 1
      }]

    }
  }
}

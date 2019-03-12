import { Component, Input, ViewChild, SimpleChanges, SimpleChange, OnChanges } from '@angular/core'
import { Chart } from 'chart.js'

@Component({
  selector: 'app-time-chart',
  templateUrl: './time-chart.component.html',
  styleUrls: ['./time-chart.component.scss']
})
export class TimeChartComponent implements OnChanges {
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

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const data: SimpleChange = changes.data
    this.data = data.currentValue

    if(this.data.some(item => item)) this.initChart()
  }

  initChart() {
    console.log(this.data)
    var timeFormat = 'DD/MM/YYYY';
    var config = {
        type:    'line',
        data:    {
            datasets: [
                {
                    label: this.labels,
                    data: this.data,
                    fill: false,
                    borderColor: 'red'
                }
            ]
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
            responsive: true,
            scales:     {
                xAxes: [{
                    type:       "time",
                    time:       {
                        format: timeFormat,
                        tooltipFormat: 'll'
                    },
                    scaleLabel: {
                        display:     true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display:     true,
                        labelString: 'value'
                    }
                }]
            }
        }
    }

    this.chart = new Chart(this.canvas.nativeElement.getContext('2d'), config)
  }
}

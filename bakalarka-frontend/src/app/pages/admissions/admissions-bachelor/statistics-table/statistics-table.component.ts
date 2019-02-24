import { Component, Input, OnChanges } from '@angular/core';
import { StatisticsTableUtil } from './statistics-table.util';

@Component({
  selector: 'app-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss']
})
export class StatisticsTableComponent implements OnChanges {

  @Input() attributesToShow = []
  @Input() data = []
  @Input() numberOfGroups = 10
  @Input() intervalsUpperLimits = [40, 50, 60, 70, 80, 90, 100]
  @Input() type

  groups = []
  intervals = {}
  summary = {}

  // table header
  header = []

  constructor(
    private Util: StatisticsTableUtil
  ) { }

  ngOnChanges() {
    if(this.type == 'groups') {
      this.groups = this.Util._calculateGroups(this.data, this.numberOfGroups)
      this.summary = this.Util._calculateSummary(this.groups)
      this.header = ['#', 'Kvantita', 'Nastúpil', 'Nastúpil (%)', 'Rozpätie bodov', 'Priemer bodov', 'Medián']
    } else {
      this.intervals = this.Util._calculateIntervals(this.data, this.intervalsUpperLimits)
      this.header = ['Decibely', 'Kvantita', 'Nastúpil', 'Nastúpil (%)']
    }
  }
}

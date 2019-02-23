import { Component, OnInit, Input, OnChanges } from '@angular/core';

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
  summary

  // table header
  header = []

  constructor() { }

  ngOnChanges() {
    this.data = this.data
    if(!this.data)
      return

    if(this.type == 'groups')
      this._calculateGroups()
    else
      this._calculateIntervals()
  }

  _calculateIntervals() {
    this.intervals = {}

    // create intervals object
    for(let i = 0; i < this.intervalsUpperLimits.length; i++) {
      let limit = this.intervalsUpperLimits[i]
      let label = `${!i ? '0' : this.intervalsUpperLimits[i-1] + 1}-${limit}`

      this.intervals[label] = {}
    }
    this.intervals[`${this.intervalsUpperLimits[this.intervalsUpperLimits.length-1]}+`] = {}

    this.data.forEach((admission) => {
      let points = Number(admission.Body_celkom)

      for(let i = 0; i < this.intervalsUpperLimits.length; i++) {
        let limit = this.intervalsUpperLimits[i]

        if(points <= limit) {
          let label = `${!i ? '0' : this.intervalsUpperLimits[i-1] + 1}-${limit}`
          this.intervals[label].count = ++this.intervals[label].count || 0

          if((admission.Rozh == 10 || admission.Rozh == 11) && admission.Štúdium == "áno")
            this.intervals[label].beganStudy = ++this.intervals[label].beganStudy || 0
          break
        }

        if(i == this.intervalsUpperLimits.length - 1) {
          this.intervals[`${limit}+`].count = ++this.intervals[`${limit}+`].count || 0

          if((admission.Rozh == 10 || admission.Rozh == 11) && admission.Štúdium == "áno")
            this.intervals[`${limit}+`].beganStudy = ++this.intervals[`${limit}+`].beganStudy || 0
        }
      }
    })

    this.header = ['Decibely', 'Kvantita', 'Nastúpil', 'Nastúpil (%)']
  }

  // TODO: simplify
  _calculateGroups() {
    this.groups = []
    let inOneGroup = Math.floor(this.data.length / this.numberOfGroups)
    let group = { mean: 0, arr: [], adm: [], beganStudy: 0 }

    this.data.forEach((admission, index) => {
      let points = Number(admission.Body_celkom)

      group.mean += points
      group.arr = this._insertionSort([points, ...group.arr])
      group.adm.push(admission)

      if((admission.Rozh == 10 || admission.Rozh == 11) && admission.Štúdium == "áno")
        group.beganStudy++

      if(index == this.data.length - 1 && group.arr.length < inOneGroup) {
        group.adm.forEach((adm, idx) => {
          this.groups[idx % this.numberOfGroups].mean += Number(adm.Body_celkom)
          if(adm.Rozh == 10 && adm.Štúdium == "áno")
            this.groups[idx % this.numberOfGroups].beganStudy++
          this.groups[idx % this.numberOfGroups].adm.push(adm)
          this.groups[idx % this.numberOfGroups].arr = this._insertionSort([Number(adm.Body_celkom), ...this.groups[idx % this.numberOfGroups].arr])
        })
      }

      if(group.arr.length == inOneGroup) {
        this.groups.push(group)
        group = { mean: 0, arr: [], adm: [], beganStudy: 0  }
      }
    })

    this.summary = { beganStudy: 0, arr: [], mean: 0 }
    this.groups.map((group) => {
      // calculate summary numbers
      this.summary.mean += group.mean
      this.summary.beganStudy += group.beganStudy
      this.summary.arr = this._mergeSort([...this.summary.arr, ...group.arr])

      group.mean /= group.arr.length
      group.median =
        group.arr.length / 2 !== 0 ?
        group.arr[Math.floor(group.arr.length / 2)] :
        (group.arr[(group.arr.length/2) - 1] + group.arr[group.arr.length/2]) / 2
      return group
    })

    // calculate mean and median for summary
    this.summary.mean /= this.summary.arr.length
      this.summary.median =
        this.summary.arr.length / 2 !== 0 ?
        this.summary.arr[Math.floor(this.summary.arr.length / 2)] :
        (this.summary.arr[(this.summary.arr.length/2) - 1] + this.summary.arr[this.summary.arr.length/2]) / 2

    this.header = ['#', 'Kvantita', 'Nastúpil', 'Nastúpil (%)', 'Rozpätie bodov', 'Priemer bodov', 'Medián']
  }

  // insertion sort is best option of sorting in this usecase, because we are keeping our
  // array sorted with every insert, so we only need to find a right place for new value
  _insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let currentVal = arr[i];
        for (var j = i - 1; j >= 0 && arr[j] > currentVal; j--) {
             arr[j + 1] = arr[j];
        }
    arr[j + 1] = currentVal;
    }
    return arr;
  }

  _merge(arr1, arr2){
    let results = [];
    let i = 0;
    let j = 0;

    while(i < arr1.length && j < arr2.length) {
        if(arr2[j] > arr1[i]) {
            results.push(arr1[i]);
            i++;
        } else {
            results.push(arr2[j])
            j++;
        }
    }

    while(i < arr1.length) {
        results.push(arr1[i])
        i++;
    }
    while(j < arr2.length) {
        results.push(arr2[j])
        j++;
    }

    return results;
  }

  // Recrusive Merge Sort
  _mergeSort(arr){
    if(arr.length <= 1) return arr;
    let mid = Math.floor(arr.length/2);
    let left = this._mergeSort(arr.slice(0,mid));
    let right = this._mergeSort(arr.slice(mid));
    return this._merge(left, right);
  }
}

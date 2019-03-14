import { Injectable } from '@angular/core';
import { SortingUtil } from 'src/app/shared/Utils/sorting.util';

@Injectable({
  providedIn: 'root'
})
export class AdmissionsUtil {

  constructor(
    private SortingUtil: SortingUtil
  ) {}

  _calculateIntervals(data, intervalsUpperLimits) {
    let intervals = {}

    // create intervals object
    for(let i = 0; i < intervalsUpperLimits.length; i++) {
      let limit = intervalsUpperLimits[i]
      let label = `${!i ? '0' : intervalsUpperLimits[i-1] + 1}-${limit}`

      intervals[label] = { count: 0, beganStudy: 0 }
    }
    intervals[`${intervalsUpperLimits[intervalsUpperLimits.length-1]}+`] = { count: 0, beganStudy: 0 }

    data.forEach((admission) => {
      let points = Number(admission.Body_celkom)

      for(let i = 0; i < intervalsUpperLimits.length; i++) {
        let limit = intervalsUpperLimits[i]

        if(points <= limit) {
          let label = `${!i ? '0' : intervalsUpperLimits[i-1] + 1}-${limit}`
          intervals[label].count++

          if((admission.Rozh == 10 || admission.Rozh == 11) && admission.Štúdium == "áno")
            intervals[label].beganStudy++
          break
        }

        if(i == intervalsUpperLimits.length - 1) {
          intervals[`${limit}+`].count++

          if((admission.Rozh == 10 || admission.Rozh == 11) && admission.Štúdium == "áno")
            intervals[`${limit}+`].beganStudy++
        }
      }
    })

    return intervals
  }

  _calculateGroups(data, numberOfGroups) {
    let groups = []
    let inOneGroup = Math.floor(data.length / numberOfGroups)
    let group = { mean: 0, arr: [], adm: [], beganStudy: 0 }

    data.sort(function(a, b) {
      return Number(a.Body_celkom) - Number(b.Body_celkom);
    })

    data.forEach((admission, index) => {
      let points = Number(admission.Body_celkom)

      group.mean += points
      group.arr = this.SortingUtil._insertionSort([points, ...group.arr])
      group.adm.push(admission)

      if((admission.Rozh == 10 || admission.Rozh == 11) && admission.Štúdium == "áno")
        group.beganStudy++

      if(index == data.length - 1 && group.arr.length < inOneGroup) {
        const lastGroupIndex = groups.length - 1

        group.adm.forEach((adm) => {
          groups[lastGroupIndex].mean += Number(adm.Body_celkom)
          if((adm.Rozh == 10 || adm.Rozh == 11) && adm.Štúdium == "áno")
            groups[lastGroupIndex].beganStudy++
          groups[lastGroupIndex].adm.push(adm)
          groups[lastGroupIndex].arr = this.SortingUtil._insertionSort([Number(adm.Body_celkom), ...groups[lastGroupIndex].arr])
        })
      }

      if(group.arr.length == inOneGroup) {
        groups.push(group)
        group = { mean: 0, arr: [], adm: [], beganStudy: 0  }
      }
    })

    return groups
  }

  _calculateSummary(groups) {
    let summary = { beganStudy: 0, arr: [], mean: 0 , median: null}

    groups.map((group) => {
      // calculate summary numbers
      summary.mean += group.mean
      summary.beganStudy += group.beganStudy
      summary.arr = this.SortingUtil._mergeSort([...summary.arr, ...group.arr])

      group.mean /= group.arr.length
      group.median =
        group.arr.length / 2 !== 0 ?
        group.arr[Math.floor(group.arr.length / 2)] :
        (group.arr[(group.arr.length/2) - 1] + group.arr[group.arr.length/2]) / 2
      return group
    })

    // calculate mean and median for summary
    summary.mean /= summary.arr.length
      summary.median =
        summary.arr.length / 2 !== 0 ?
        summary.arr[Math.floor(summary.arr.length / 2)] :
        (summary.arr[(summary.arr.length/2) - 1] + summary.arr[summary.arr.length/2]) / 2

    return summary
  }
}

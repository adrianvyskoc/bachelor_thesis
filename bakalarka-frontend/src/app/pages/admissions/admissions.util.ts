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

          if((admission.Rozh == 10 || admission.Rozh == 11 || admission.Rozh == 13) && admission.Štúdium == "áno")
            intervals[label].beganStudy++
          break
        }

        if(i == intervalsUpperLimits.length - 1) {
          intervals[`${limit}+`].count++

          if((admission.Rozh == 10 || admission.Rozh == 11 || admission.Rozh == 13) && admission.Štúdium == "áno")
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

      if((admission.Rozh == 10 || admission.Rozh == 11 || admission.Rozh == 13) && admission.Štúdium == "áno")
        group.beganStudy++

      if(index == data.length - 1 && group.arr.length < inOneGroup) {
        const lastGroupIndex = groups.length - 1

        group.adm.forEach((adm) => {
          groups[lastGroupIndex].mean += Number(adm.Body_celkom)
          if((adm.Rozh == 10 || adm.Rozh == 11 || admission.Rozh == 11) && adm.Štúdium == "áno")
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

  /**
   * Vytvorí usporiadané pole dátumov prihlášok. Toto pole nám slúži na zobrazenie grafu,
   * ktorý nám dáva informáciu o tom, kedy si študenti začali podávať prihlášky.
   * @param admissions pole prihlášok, z ktorých chceme vypočítať dané údaje
   */
  _getAdmissionsDates(admissions) {
    let admissionsTimes = admissions.reduce((acc, admission) => {
      if(admission['Prevedené']) {
        acc.push(admission['Prevedené'].split(".").join("/"))
      }
      return acc
    }, [])

    admissionsTimes.sort(sortByDate);​

    admissionsTimes = admissionsTimes.reduce((acc, admission, idx) => {
      acc.push({x: admission, y: idx})
      return acc
    }, [])

    return admissionsTimes

    function sortByDate(a, b) {
      let [add, amm, ayyyy] = a.split("/")
      let [bdd, bmm, byyyy] = b.split("/")

      var dateA = new Date()
      var dateB = new Date()

      dateA.setFullYear(ayyyy); dateB.setFullYear(byyyy)
      dateA.setMonth(amm); dateB.setMonth(bmm)
      dateA.setDate(add); dateB.setDate(bdd)

      return dateA.getTime() > dateB.getTime() ? 1 : -1
    }
  }

  /**
   * Vytvorí pole objektov, kde jeden objekt obsahuje dátum (x) a číslo (y), ktoré reprezentuje počet prihlášok podaných v daný deň.
   * @param admissions pole prihlášok, z ktorých chceme vypočítať dané údaje
   */
  _getAdmissionsPerDay(admissions) {
    let admissionsPerDayObj = admissions.reduce((acc, admission) => {
      acc[admission['Prevedené']] = ++acc[admission['Prevedené']] || 0
      return acc
    }, {})

    let admissionsPerDay = []
    for(let day in admissionsPerDayObj) {
      if(day == "null") continue

      admissionsPerDay.push({
        x: day.split(".").join("/"),
        y: admissionsPerDayObj[day]
      })
    }

    admissionsPerDay.sort(sortByDateByKey)

    return admissionsPerDay;​

    function sortByDateByKey(a, b) {
      let [add, amm, ayyyy] = a.x.split("/")
      let [bdd, bmm, byyyy] = b.x.split("/")

      var dateA = new Date()
      var dateB = new Date()

      dateA.setFullYear(ayyyy); dateB.setFullYear(byyyy)
      dateA.setMonth(amm); dateB.setMonth(bmm)
      dateA.setDate(add); dateB.setDate(bdd)

      return dateA.getTime() > dateB.getTime() ? 1 : -1
    }
  }
}

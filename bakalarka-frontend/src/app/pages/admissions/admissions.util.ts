import { Injectable } from '@angular/core';
import { SortingUtil } from 'src/app/plugins/utils/sorting.util';
import { AdmissionsFilterService } from './admissions-filter.service';

@Injectable({
  providedIn: 'root'
})
export class AdmissionsUtil {

  constructor(
    private SortingUtil: SortingUtil,
    private AdmissionsFilterService: AdmissionsFilterService
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

  /**
   * Funkcia na vypočítanie metrík pre skupiny rozdelené podľa bodov.
   * @param data - dáta, z ktorých tvoríme skupiny
   * @param numberOfGroups - požadovaný počet skupín
   */
  _calculateGroups(data, numberOfGroups) {
    let groups = []
    let inOneGroup = Math.floor(data.length / numberOfGroups)
    let group = { mean: 0, arr: [], adm: [], beganStudy: 0 }

    // dáta musíme zoradiť podľa bodov od najmenšieho aby sme vytvorili skupiny rovnakej veľkosti rovnomerného rozloženia bodov
    data.sort(function(a, b) {
      return Number(a.Body_celkom) - Number(b.Body_celkom);
    })

    // preiterovanie dát
    data.forEach((admission, index) => {
      let points = Number(admission.Body_celkom)

      // spočítavanie bodov (neskôr sa body vydelia počtom aby sme dostali mean)
      group.mean += points
      group.arr = this.SortingUtil._insertionSort([points, ...group.arr])
      group.adm.push(admission)

      // ak je študent prijatý a naozaj začal študovať
      if((admission.Rozh == 10 || admission.Rozh == 11 || admission.Rozh == 13) && admission.Štúdium == "áno")
        group.beganStudy++

      // ak sme na konci dát ale v poslednej skupine nie je dostatok ludí, musíme rozdeliť  túto skupinu do všetkých skupín
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

  /**
   * Funkcia, pomocou ktorej vypočítame zhrnutie (hodnoty pre všetky skupiny dokopy) zo skupín vypočítaných funkciou _calculateGroups
   * @param groups - skupiny, pre ktoré počítame zhrnutie
   */
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
      acc[admission['Prevedené']] = ++acc[admission['Prevedené']] || 1
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

  /**
   * Funkcia, ktorá spočíta základné hodnoty pre zahraničných študentov.
   * @param admissions
   */
  _calculateAbroadStudents(admissions) {
    let programmes = {}
    const abroadAdmissions = this.AdmissionsFilterService.filterAbroadStudents(admissions)

    abroadAdmissions.forEach(admission => {
      if(!programmes[admission['Program_1']]) {
        programmes[admission['Program_1']] = {count: 0, beganStudy: 0, rejected: 0, approved: 0}
      }

      programmes[admission['Program_1']].count++

      // ak bol uchádzač prijatý
      if(admission.Rozh == 10 || admission.Rozh == 11 || admission.Rozh == 13) {
        if(admission.Štúdium == "áno")
          programmes[admission['Program_1']].beganStudy++
        programmes[admission['Program_1']].approved++
      } else {
        programmes[admission['Program_1']].rejected++
      }
    })

    let counts = { approved: 0, rejected: 0, beganStudy: 0 }
    Object.keys(programmes).forEach(key => {
      counts.approved += programmes[key].approved
      counts.rejected += programmes[key].rejected
      counts.beganStudy += programmes[key].beganStudy
    })

    return { programmes, ...counts, admissions: abroadAdmissions }
  }
}

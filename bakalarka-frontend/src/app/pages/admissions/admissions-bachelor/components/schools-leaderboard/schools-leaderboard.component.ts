import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-schools-leaderboard',
  templateUrl: './schools-leaderboard.component.html',
  styleUrls: ['./schools-leaderboard.component.scss']
})
export class SchoolsLeaderboardComponent implements OnChanges {

  @ViewChild('schoolsPaginator') schoolsPaginator: MatPaginator
  @ViewChild('schoolsSort') schoolsSort: MatSort

  @Input() schools = []
  @Input() admissions = []

  tableData

  displayedSchoolsColumns = ['kod_kodsko', 'nazov', 'pocet_prihlasok', 'pocet_prijatych', 'pocet_nastupenych', 'prijaty/prihlasky', 'nastupeny/prihlasky', 'nastupeny/prijaty']

  constructor() { }

  ngOnChanges() {
    this._getSchoolsData()
  }

  /**
   * Výpočet dát, ktoré hovoria o počte prihlášok, nastúpených a prijatých uchádzačoch a pomermi medzi týmito hodnotami
   */
  _getSchoolsData() {
    let schoolMap = {}

    // tvorba mapy škôl (objekt, kde key je school_id a jeho hodnotu je objekt s jednotlivými počtami a pomermi)
    this.schools.map(school => {
      schoolMap[school.kod_kodsko] = {}
      schoolMap[school.kod_kodsko].kod_kodsko = school.kod_kodsko
      schoolMap[school.kod_kodsko].nazov = school.nazov
      schoolMap[school.kod_kodsko].pocet_nastupenych = 0
      schoolMap[school.kod_kodsko].pocet_prijatych = 0
      schoolMap[school.kod_kodsko].pocet_prihlasok = 0
    })
    schoolMap['neuvedené'] = { pocet_prihlasok: 0, pocet_nastupenych: 0, pocet_prijatych: 0 }

    // výpočet počtu prihlášok, nastúpených a prijatých
    this.admissions.forEach(admission => {
      if(schoolMap[admission.school_id])
        schoolMap[admission.school_id].pocet_prihlasok++
      else
        schoolMap['neuvedené'].pocet_prihlasok++

      if((admission.Rozh == 10 || admission.Rozh == 11 || admission.Rozh == 13)) {
        if(schoolMap[admission.school_id]) {
          if(admission.Štúdium == "áno")
            schoolMap[admission.school_id].pocet_nastupenych++
          schoolMap[admission.school_id].pocet_prijatych++
        }
        else {
          if(admission.Štúdium == "áno")
            schoolMap['neuvedené'].pocet_nastupenych++
          schoolMap['neuvedené'].pocet_prijatych++
        }
      }
    })

    // Výpočet pomerov
    for(let school in schoolMap) {
      schoolMap[school]['prijaty/prihlasky'] = schoolMap[school].pocet_prijatych ?
        (100 * schoolMap[school].pocet_prijatych / schoolMap[school].pocet_prihlasok).toFixed(2) :
        0
      schoolMap[school]['nastupeny/prihlasky'] = schoolMap[school].pocet_nastupenych ?
        (100 * schoolMap[school].pocet_nastupenych / schoolMap[school].pocet_prihlasok).toFixed(2) :
        0
      schoolMap[school]['nastupeny/prijaty'] = schoolMap[school].pocet_prijatych ?
        (100 * schoolMap[school].pocet_nastupenych / schoolMap[school].pocet_prijatych).toFixed(2) :
        0
    }

    this.tableData = new MatTableDataSource<any[]>(Object.values(schoolMap))
    this.tableData.paginator = this.schoolsPaginator
    this.tableData.sort = this.schoolsSort
  }

}

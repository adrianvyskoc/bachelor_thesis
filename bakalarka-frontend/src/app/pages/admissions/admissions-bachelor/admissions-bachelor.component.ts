import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { DataService } from 'src/app/shared/data.service';
import { AdmissionsFilterService } from '../admissions-filter.service';

@Component({
  selector: 'app-admissions-bachelor',
  templateUrl: './admissions-bachelor.component.html',
  styleUrls: ['./admissions-bachelor.component.scss']
})
export class AdmissionsBachelorComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild('schoolsPaginator') schoolsPaginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatSort) schoolsSort: MatSort

  showFilter = true
  showLabels = false
  subscription: Subscription
  admissions
  schools
  filteredAdmissions = []

  admissionsTimes = []

  graduationYear: number
  numberOfGroups: number = 10
  decibels = [40,50,60,70,80,90,100]

  displayedSchoolsColumns = ['kod_kodsko', 'nazov', 'pocet_prihlasok', 'pocet_nastupenych', 'pocet_prijatych', 'prijaty/prihlasky', 'nastupeny/prijaty', 'nastupeny_prihlasky']

  displayedAdmissionsColumns = ['id', 'Meno', 'Priezvisko', 'E_mail', 'Rozhodnutie_o_prijatí']
  allColumns = [
    "AIS_ID", "school_id", "Por", "Priezvisko", "Meno", "Absolvovaná_VŠ", "Abs_VŠ_program_odbor_text", "Abs_VŠ_program_odbor",
    "Abs_VŠ", "Alt_pr_1", "Alternatívny_program_1", "Body_celkom", "Body", "Narodenie", "Prevedené", "Prijaté", "Maturita", "E_mail",
    "Et", "Fakulta", "Forma", "Forma_1", "Kompl", "Kontaktná_adresa", "č_d", "Kontaktná_adresa_obec", "Kont_adresa_obec",
    "Kont_adresa_okres", "Kont_adr_pozn", "PSČ", "Kont_adresa_štát", "Kont_adresa_ulica", "Kont_adresa_ulica_1", "Kontaktný_tel",
    "Metóda", "Miesto_narodenia", "Miesto_výučby", "Modifikácia_PK", "Najvyššie_dosiahnuté_vzdelanie", "Občianstvo", "Odbor_na_SŠ",
    "Odbor_SŠ", "Odkiaľ_sa_hlási", "Odvolanie", "Pohlavie", "Štúdium", "Priemer_SŠ", "Priemer_SŠ_1", "Prijatie_na_program",
    "Prijatie_na_program_1", "Program", "Program_1", "Program_2", "Reg_č", "Stav", "Rodné_číslo", "Maturita_1",
    "Rozh", "Stredná_škola", "Stredná_škola_adresa", "Stredná_škola_1", "Stredná_škola_cudzinci", "Súčasné_štúdium", "Súhlas_ZS",
    "Študijný_odbor", "Termín", "Čas", "Dátum", "Miestnosť", "Titul", "Titul_za", "Adresa_trvalého_pobytu", "č_d_1", "Trvalý_pobyt_obec",
    "Trv_pobyt_obec", "Trv_pobyt_okres", "Trv_pobyt_pozn", "PSČ_1", "Trv_pobyt_štát", "Trv_pobyt_ulica", "Trv_pobyt_ulica_1", "Predmety",
    "Zameranie", "Zapl", "Zvol_predmet", "Zvol_predmet_1"
  ]
  filteredColumns = this.allColumns

  constructor(
    private dataService: DataService,
    private exportService: ExportService,
    private admissionsFilterService: AdmissionsFilterService
  ) { }

  ngOnInit() {
    this.dataService.getAdmissionsBachelor()
    this.subscription = this.dataService.getAdmissionsBachelorUpdateListener()
      .subscribe(
        (data:any[]) => {
          this.filteredAdmissions = data['admissions']
          this.schools = data['schools']
          this.admissions = new MatTableDataSource<any[]>(data['admissions'])
          this.admissions.paginator = this.paginator
          this.admissions.sort = this.sort
          this._getSchoolsData()
          this._getAdmissionsDates()
        }
      )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  onDecibelsChange(event) {
    let val = event.target.value.split(",")

    if(val[0] == "")
      this.decibels = [40,50,60,70,80,90,100]
    else
      this.decibels = val.map(item => Number(item))
  }

  applyFilter(value: string) {
    this.admissions.filter = value.trim().toLowerCase();
  }

  filterLabels(value: string) {
    this.filteredColumns = this.allColumns.filter(col => col.indexOf(value) > -1)
  }

  filterByGraduationYear() {
    this.filteredAdmissions = this.admissionsFilterService.filterByGraduationYear(this.admissions.data, this.graduationYear)
  }

  toggleColumn(column) {
    const index = this.displayedAdmissionsColumns.indexOf(column)
    if(index > -1) {
      this.displayedAdmissionsColumns.splice(index, 1)
    } else {
      this.displayedAdmissionsColumns.push(column)
    }
  }

  switchTabs() {
    this.showFilter = !this.showFilter;
    this.showLabels = !this.showLabels;
  }

  selectAll() {
    this.displayedAdmissionsColumns = this.allColumns.slice()
    this.filteredColumns = this.allColumns.slice()
  }

  deselectAll() {
    this.displayedAdmissionsColumns = []
  }

  exportAll() {
    const tables = document.querySelector('table')
    this.exportService.exportTableToExcel(tables, 'admissions')
  }

  _displayedColumnsAndActions() {
    return [...this.displayedAdmissionsColumns, 'Akcie']
  }

  _getSchoolsData() {
    let schoolMap = {}

    this.schools.map(school => {
      schoolMap[school.kod_kodsko] = {}
      schoolMap[school.kod_kodsko].kod_kodsko = school.kod_kodsko
      schoolMap[school.kod_kodsko].nazov = school.nazov
      schoolMap[school.kod_kodsko].pocet_nastupenych = 0
      schoolMap[school.kod_kodsko].pocet_prijatych = 0
      schoolMap[school.kod_kodsko].pocet_prihlasok = 0
    })
    schoolMap['neuvedené'] = { pocet_prihlasok: 0, pocet_nastupenych: 0, pocet_prijatych: 0 }

    this.admissions.data.forEach(admission => {
      if(schoolMap[admission.school_id])
        schoolMap[admission.school_id].pocet_prihlasok++
      else
        schoolMap['neuvedené'].pocet_prihlasok++

      if((admission.Rozh == 10 || admission.Rozh == 11)) {
        if(schoolMap[admission.school_id])
          admission.Štúdium == "áno" ? schoolMap[admission.school_id].pocet_nastupenych++ : schoolMap[admission.school_id].pocet_prijatych++
        else
          admission.Štúdium == "áno" ? schoolMap['neuvedené'].pocet_nastupenych++ : schoolMap['neuvedené'].pocet_prijatych++
      }
    })

    this.schools = new MatTableDataSource<any[]>(Object.values(schoolMap))
    this.schools.paginator = this.schoolsPaginator
    this.admissions.sort = this.sort
  }

  _getAdmissionsDates() {
    var admissionsTimes = this.admissions.data.reduce((acc, admission) => {
      if(admission['Prevedené']) {
        acc.push(admission['Prevedené'].split(".").join("/"))
      }
      return acc
    }, [])

    function sortFunction(a,b) {
      let [add, amm, ayyyy] = a.split("/")
      let [bdd, bmm, byyyy] = b.split("/")

      var dateA = new Date()
      var dateB = new Date()

      dateA.setFullYear(ayyyy); dateB.setFullYear(byyyy);
      dateA.setMonth(amm); dateB.setMonth(bmm);
      dateA.setDate(add); dateB.setDate(bdd);
      return dateA.getTime() > dateB.getTime() ? 1 : -1;
    };

    admissionsTimes.sort(sortFunction);​

    var admissionsTimes = admissionsTimes.reduce((acc, admission, idx) => {
      acc.push({x: admission, y: idx})

      return acc
    }, [])

    this.admissionsTimes = admissionsTimes
  }
}

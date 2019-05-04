import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { DataService } from 'src/app/shared/data.service';
import { AdmissionsFilterService } from '../admissions-filter.service';
import { AdmissionsUtil } from '../admissions.util';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admissions-bachelor',
  templateUrl: './admissions-bachelor.component.html',
  styleUrls: ['./admissions-bachelor.component.scss']
})
export class AdmissionsBachelorComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild('schoolsPaginator') schoolsPaginator: MatPaginator
  @ViewChild('admSort') admSort: MatSort
  @ViewChild('schoolsSort') schoolsSort: MatSort

  showFilter = true
  showLabels = false
  subscription: Subscription

  admissions
  schools
  filteredAdmissions = []

  admissionsTimes = []
  admissionsPerDay = []

  graduationYear: number
  numberOfGroups: number = 10

  displayedSchoolsColumns = ['kod_kodsko', 'nazov', 'pocet_prihlasok', 'pocet_prijatych', 'pocet_nastupenych', 'prijaty/prihlasky', 'nastupeny/prihlasky', 'nastupeny/prijaty']

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
    "Zameranie", "Zapl", "Zvol_predmet", "Zvol_predmet_1", 'stupen_studia',
    "Externá_maturita_z_cudzieho_jazyka_ECJ", "Externá_maturita_z_matematiky_EM", "Písomný_test_z_matematiky_SCIO_PTM", "Všeobecné_študijné_predpoklady_SCIO_VŠP"
  ]
  filteredColumns = this.allColumns

  constructor(
    private dataService: DataService,
    private exportService: ExportService,
    private admissionsFilterService: AdmissionsFilterService,
    private admissionsUtil: AdmissionsUtil,
    private tocUtil: TocUtil,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Prijímacie konanie - Bakalársky stupeň")
    this.tocUtil.createToc()
    this.dataService.getAdmissionsBachelor()
    this.subscription = this.dataService.getAdmissionsBachelorUpdateListener()
      .subscribe(
        (data:any[]) => {
          this.filteredAdmissions = data['admissions']
          this.schools = data['schools']
          this.admissions = new MatTableDataSource<any[]>(data['admissions'])
          this.admissions.paginator = this.paginator
          this.admissions.sort = this.admSort
          this.admissionsTimes = this.admissionsUtil._getAdmissionsDates(this.admissions.data)
          this.admissionsPerDay = this.admissionsUtil._getAdmissionsPerDay(this.admissions.data)

          console.log(this.admissionsTimes)
          console.log(this.admissionsPerDay)

          this._getSchoolsData()
        }
      )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
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

  /**
   * Funkcia zodpovedná za exportovanie všetkých tabuliek do xlsx súboru. Každá tabuľka bude na osobitnom hárku.
   */
  exportAllTables() {
    const tables = document.querySelectorAll("table:not([mat-table])")
    this.exportService.exportMultipleTablesToExcel(tables, 'bachelor-overview', [
      {
        data: this.admissions.filteredData,
        attrs: this.displayedAdmissionsColumns,
      },
      {
        data: this.schools['data']
      }
    ])
  }

  /**
   * Funkcia ktorá exportuje do xslx súboru vyfiltrované dáta z tabuľky (len zvolené stĺpce a riadky)
   */
  exportFiltered() {
    this.exportService.exportArrayOfObjectToExcel(this.admissions.filteredData, 'filtered_admissions', this.displayedAdmissionsColumns);
  }

  /**
   * Funkcia, ktorá exportuje do xlsx súboru dáta, ktoré momentálne vidíme v tabuľke (zobrazenú stranu a zvolené stĺpce)
   */
  exportVisible() {
    const tables = document.querySelector('table')
    this.exportService.exportTableToExcel(tables, 'admissions')
  }

  /**
   * Funkcia, ktorá exportuje do xlsx súboru všetky údaje z tabuľky bez ohľadu na filtrovanie
   */
  exportAll() {
    this.exportService.exportArrayOfObjectToExcel(this.admissions.data, 'all_admissions');
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
    this.admissions.data.forEach(admission => {
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

    this.schools = new MatTableDataSource<any[]>(Object.values(schoolMap))
    this.schools.paginator = this.schoolsPaginator
    this.schools.sort = this.schoolsSort
  }

  /**
   * Funkcia ktorá vráti všetky stĺpce, ktoré chceme zobraziť v tabuľke a pridá stĺpec akcie
   */
  _displayedColumnsAndActions() {
    return [...this.displayedAdmissionsColumns, 'Akcie']
  }
}

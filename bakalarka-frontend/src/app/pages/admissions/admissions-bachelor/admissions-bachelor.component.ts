import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { DataService } from 'src/app/shared/data.service';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admissions-bachelor',
  templateUrl: './admissions-bachelor.component.html',
  styleUrls: ['./admissions-bachelor.component.scss']
})
export class AdmissionsBachelorComponent implements OnInit, OnDestroy {
  @ViewChild('paginator', {static: false}) paginator: MatPaginator
  @ViewChild('admSort', {static: false}) admSort: MediaStreamErrorEventInit

  showFilter = true
  showLabels = false
  subscription: Subscription

  admissions
  schools = []
  filteredAdmissions = []

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
   * Funkcia ktorá vráti všetky stĺpce, ktoré chceme zobraziť v tabuľke a pridá stĺpec akcie
   */
  _displayedColumnsAndActions() {
    return [...this.displayedAdmissionsColumns, 'Akcie']
  }
}

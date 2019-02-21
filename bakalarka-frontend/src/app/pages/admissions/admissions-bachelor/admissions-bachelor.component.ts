import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { DataService } from 'src/app/shared/data.service';
import { NullInjector } from '@angular/core/src/di/injector';

@Component({
  selector: 'app-admissions-bachelor',
  templateUrl: './admissions-bachelor.component.html',
  styleUrls: ['./admissions-bachelor.component.scss']
})
export class AdmissionsBachelorComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  showFilter = true
  showLabels = false
  subscription: Subscription
  admissions

  // groups properties
  numberOfGroups: number = 10
  groups = []

  displayedAdmissionsColumns = ['id', 'Meno', 'Priezvisko', 'E_mail']
  allColumns = [
    "AIS_ID", "school_id", "Por", "Priezvisko", "Meno", "Absolvovaná_VŠ", "Abs_VŠ_program_odbor_text", "Abs_VŠ_program_odbor",
    "Abs_VŠ", "Alt_pr_1", "Alternatívny_program_1", "Body_celkom", "Body", "Narodenie", "Prevedené", "Prijaté", "Maturita", "E_mail",
    "Et", "Fakulta", "Forma", "Forma_1", "Kompl", "Kontaktná_adresa", "č_d", "Kontaktná_adresa_obec", "Kont_adresa_obec",
    "Kont_adresa_okres", "Kont_adr_pozn", "PSČ", "Kont_adresa_štát", "Kont_adresa_ulica", "Kont_adresa_ulica_1", "Kontaktný_tel",
    "Metóda", "Miesto_narodenia", "Miesto_výučby", "Modifikácia_PK", "Najvyššie_dosiahnuté_vzdelanie", "Občianstvo", "Odbor_na_SŠ",
    "Odbor_SŠ", "Odkiaľ_sa_hlási", "Odvolanie", "Pohlavie", "Štúdium", "Priemer_SŠ", "Priemer_SŠ_1", "Prijatie_na_program",
    "Prijatie_na_program_1", "Program", "Program_1", "Program_2", "Reg_č", "Stav", "Rodné_číslo", "Maturita_1", "Rozhodnutie_o_prijatí",
    "Rozh", "Stredná_škola", "Stredná_škola_adresa", "Stredná_škola_1", "Stredná_škola_cudzinci", "Súčasné_štúdium", "Súhlas_ZS",
    "Študijný_odbor", "Termín", "Čas", "Dátum", "Miestnosť", "Titul", "Titul_za", "Adresa_trvalého_pobytu", "č_d_1", "Trvalý_pobyt_obec",
    "Trv_pobyt_obec", "Trv_pobyt_okres", "Trv_pobyt_pozn", "PSČ_1", "Trv_pobyt_štát", "Trv_pobyt_ulica", "Trv_pobyt_ulica_1", "Predmety",
    "Zameranie", "Zapl", "Zvol_predmet", "Zvol_predmet_1"
  ]
  filteredColumns = this.allColumns

  admissionsData:{ info: any, info4: any, pkss: any, pkss4: any, ib: any } = { info: [], info4: [], pkss: [], pkss4: [], ib: [] }

  constructor(
    private dataService: DataService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.dataService.getData('Admissions')
    this.subscription = this.dataService.getAdmissionsUpdateListener()
      .subscribe(
        (admissions:any[]) => {
          this.admissions = new MatTableDataSource<any[]>(admissions)
          this.admissions.paginator = this.paginator
          this.admissions.sort = this.sort

          this.admissionsData.info = this.admissions.data.filter(admission => admission.Program_1 == 'B-INFO')
          this.admissionsData.info4 = this.admissions.data.filter(admission => admission.Program_1 == 'B-INFO4')
          this.admissionsData.pkss = this.admissions.data.filter(admission => admission.Program_1 == 'B-IT')
          this.admissionsData.pkss4 = this.admissions.data.filter(admission => admission.Program_1 == 'B-IT4')
          this.admissionsData.ib = this.admissions.data.filter(admission => admission.Program_1 == 'B-IB')

          this._calculateGroups()
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

  exportAll() {
    const tables = document.querySelector('table')
    this.exportService.exportTableToExcel(tables, 'admissions')
  }

  _displayedColumnsAndActions() {
    return [...this.displayedAdmissionsColumns, 'Akcie']
  }

  _calculateGroups() {
    this.groups = []
    let inOneGroup = Math.floor(this.admissions.data.length / this.numberOfGroups)
    let group = { mean: 0, arr: [] }

    this.admissions.data.forEach((admission, index) => {
      let points = Number(admission.Body_celkom)

      group.mean += points
      group.arr = this._insertionSort([points, ...group.arr])

      if(index == this.admissions.data.length - 1 && group.arr.length < inOneGroup) {
        group.arr.forEach((adm, idx) => {
          this.groups[idx % this.numberOfGroups].arr = this._insertionSort([adm, ...this.groups[idx % this.numberOfGroups].arr])
        })
      }

      if(group.arr.length == inOneGroup) {
        this.groups.push(group)
        group = { mean: 0, arr: [] }
      }
    })

    this.groups.map((group) => {
      group.mean /= group.arr.length
      group.median = group.arr.length / 2 !== 0 ? group.arr[Math.floor(group.arr.length / 2)] : (group.arr[(group.arr.length/2) - 1] + group.arr[group.arr.length/2]) / 2
      return group
    })
  }

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
}

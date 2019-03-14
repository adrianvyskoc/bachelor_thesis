import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { AdmissionsUtil } from '../admissions.util';

@Component({
  selector: 'app-admissions-master',
  templateUrl: './admissions-master.component.html',
  styleUrls: ['./admissions-master.component.scss']
})
export class AdmissionsMasterComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  admissions

  admissionsTimes = []
  admissionsPerDay = []

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
    "Zameranie", "Zapl", "Zvol_predmet", "Zvol_predmet_1", 'stupen_studia'
  ]

  constructor(
    private dataService: DataService,
    private exportService: ExportService,
    private admissionsUtil: AdmissionsUtil
  ) { }

  ngOnInit() {
    this.dataService.getAdmissionsMaster()
    this.dataService.getAdmissionsMasterUpdateListener()
      .subscribe(data => {
        this.admissions = new MatTableDataSource<any[]>(data['admissions'])
        this.admissions.paginator = this.paginator
        this.admissions.sort = this.sort
        this.admissionsTimes = this.admissionsUtil._getAdmissionsDates(this.admissions.data)
        this.admissionsPerDay = this.admissionsUtil._getAdmissionsPerDay(this.admissions.data)
      })
  }

  exportAll() {
    const tables = document.querySelector('table')
    this.exportService.exportTableToExcel(tables, 'admissions')
  }

  _displayedColumnsAndActions() {
    return [...this.displayedAdmissionsColumns, 'Akcie']
  }
}

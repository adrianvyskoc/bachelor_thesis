import { Component, OnInit } from '@angular/core';
import { AdmissionsManagementService } from './admissions-management.service';
import { NgForm } from '@angular/forms';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admissions-management',
  templateUrl: './admissions-management.component.html',
  styleUrls: ['./admissions-management.component.scss']
})
export class AdmissionsManagementComponent implements OnInit {

  surname: string
  admissions = []
  showNotification = false
  message
  success
  chosenAdmission
  searchedAttrName: string
  year: string
  acceptDelete: boolean = false

  allAttrs = [
    "id", "AIS_ID", "school_id", "Por", "Priezvisko", "Meno", "Absolvovaná_VŠ", "Abs_VŠ_program_odbor_text", "Abs_VŠ_program_odbor",
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
  filteredAttrs


  constructor(
    private AdmissionsManagementService: AdmissionsManagementService,
    private exportService: ExportService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Prijímacie konanie - Manažment")
    this.filteredAttrs = this.allAttrs
  }

  onAttrSearch() {
    if(!this.searchedAttrName) {
      this.filteredAttrs = this.allAttrs
      return
    }

    this.filteredAttrs = this.allAttrs.filter(attr => attr.indexOf(this.searchedAttrName) > -1)
  }

  onAdmissionSearch() {
    this.AdmissionsManagementService.getAdmissionsByName(this.surname)
      .subscribe((admissions:any) => this.admissions = admissions.admissions)
  }

  onAdmissionUpdate(admission) {
    this.chosenAdmission = admission
  }

  onExportAdmissions() {
    this.exportService.exportArrayOfObjectToExcel(this.admissions, `admissions${this.surname ? '-' + this.surname : ''}`)
  }

  onAdmissionDelete(id) {
    this.AdmissionsManagementService.deleteAdmission(id)
      .subscribe((resp) => {
        this.showNotification = true
        this.success = resp['success']
        this.message = resp['message']

        if(this.success)
          this.chosenAdmission = null

        this.onAdmissionSearch()

        setTimeout(() => {
          this.showNotification = false
        }, 5000)
      })
  }

  onUpdate(form: NgForm) {
    this.AdmissionsManagementService.updateAdmission(form.value)
      .subscribe((resp) => {
        this.showNotification = true
        this.success = resp['success']
        this.message = resp['message']

        if(this.success)
          this.chosenAdmission = null

        setTimeout(() => {
          this.showNotification = false
        }, 5000)
      })
  }

  deleteAdmissionsForGivenYear() {
    this.AdmissionsManagementService.deleteAdmissionsForGivenYear(this.year)
      .subscribe((resp) => {
        this.showNotification = true
        this.success = resp['success']
        this.message = resp['message']

        if(this.success)
          this.chosenAdmission = null

        setTimeout(() => {
          this.showNotification = false
        }, 5000)
      })
  }

  deleteAllAdmissions() {
    this.AdmissionsManagementService.deleteAllAdmissions()
      .subscribe((resp) => {
        this.showNotification = true
        this.success = resp['success']
        this.message = resp['message']

        if(this.success)
          this.chosenAdmission = null

        setTimeout(() => {
          this.showNotification = false
        }, 5000)
      })
  }

  changeSchoolYearForGivenYear(form: NgForm) {
    this.AdmissionsManagementService.changeSchoolYearForGivenYear(form.value)
      .subscribe((resp) => {
        this.showNotification = true
        this.success = resp['success']
        this.message = resp['message']

        setTimeout(() => {
          this.showNotification = false
        }, 5000)
      })
  }
}

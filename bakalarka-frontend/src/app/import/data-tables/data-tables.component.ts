import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataService } from 'src/app/data.service';

export interface AttendanceElement {
  AIS_ID: number
  KOD: string
  OBDOBIE: string
  PREDMET: string
  PORADI: number
  ROZVRHOVA_AKCIA: string
  ROZVRHOVA_AKCIA_ID: number
  UCAST: string
  UCAST_ID: number
}

export interface StudentElement {
  AIS_ID: number
  PRIEZVISKO: string
  MENO: string
  STUDIUM: string
  ROCNIK: number
}

export interface GradeElement {
  AIS_ID: number
  RCS: string
  KOD: string
  PREDMET: string
  ZAP_VYSLEDOK: string
  PREDMET_VYSLEDOK: string
  POCET_ZAPISOV: number
  KREDITY: number
}

@Component({
  selector: 'app-data-tables',
  templateUrl: './data-tables.component.html',
  styleUrls: ['./data-tables.component.scss']
})
export class DataTablesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort

  attendanceSubscription: Subscription
  admissionsSubscription: Subscription
  studentsSubscription: Subscription
  gradesSubscription: Subscription

  // Attendance table
  @ViewChild('attPaginator') attendancePaginator: MatPaginator
  displayedAttendanceColumns: string[] = ['AIS_ID', 'KOD', 'OBDOBIE', 'PORADI', 'PREDMET', 'ROZVRHOVA_AKCIA', 'ROZVRHOVA_AKCIA_ID', 'UCAST', 'UCAST_ID']
  attendance

  // Admissions table
  @ViewChild('admPaginator') admissionsPaginator: MatPaginator
  displayedAdmissionsColumns: string[] = [
    "AIS_ID", "school_id", "Por", "Priezvisko", "Meno", "Absolvovaná_VŠ", "Abs_VŠ_program_odbor_text", "Abs_VŠ_program_odbor",
    "Abs_VŠ", "Alt_pr_1", "Alternatívny_program_1", "Body_celkom", "Body", "Narodenie", "Prevedené", "Prijaté", "Maturita", "E_mail",
    "Et", "Fakulta", "Forma", "Forma_1", "Kompl", "Kontaktná_adresa", "č_d", "Kontaktná_adresa_obec", "Kont_adresa_obec",
    "Kont_adresa_okres", "Kont_adr_pozn", "PSČ", "Kont_adresa_štát", "Kont_adresa_ulica", "Kont_adresa_ulica_1", "Kontaktný_tel",
    "Metóda", "Miesto_narodenia", "Miesto_výučby", "Modifikácia_PK", "Najvyššie_dosiahnuté_vzdelanie", "Občianstvo", "Odbor_na_SŠ",
    "Odbor_SŠ", "Odkiaľ_sa_hlási", "Odvolanie", "Pohlavie", "Štúdium", "Priemer_SŠ", "Priemer_SŠ_1", "Prijatie_na_program",
    "Prijatie_na_program_1", "Program", "Program_1", "Program_2", "Reg_č", "Stav", "Rodné_číslo", "Maturita_1", "Rozhodnutie_o_prijatí",
    "Rozh", "Stredná_škola_adresa", "Stredná_škola_1", "Stredná_škola_cudzinci", "Súčasné_štúdium", "Súhlas_ZS",
    "Študijný_odbor", "Termín", "Čas", "Dátum", "Miestnosť", "Titul", "Titul_za", "Adresa_trvalého_pobytu", "č_d_1", "Trvalý_pobyt_obec",
    "Trv_pobyt_obec", "Trv_pobyt_okres", "Trv_pobyt_pozn", "PSČ_1", "Trv_pobyt_štát", "Trv_pobyt_ulica", "Trv_pobyt_ulica_1", "Predmety",
    "Zameranie", "Zapl", "Zvol_predmet", "Zvol_predmet_1"
  ]
  admissions

  // Students table
  @ViewChild('stdPaginator') studentsPaginator: MatPaginator
  displayedStudentsColumns: string[] = ['AIS_ID', 'MENO', 'PRIEZVISKO', 'STUDIUM', 'ROCNIK']
  students

  // Grades table
  @ViewChild('grdPaginator') gradesPaginator: MatPaginator
  displayedGradesColumns: string[] = ['AIS_ID', 'RCS', 'KOD', 'PREDMET', 'ZAP_VYSLEDOK', 'PREDMET_VYSLEDOK', 'POCET_ZAPISOV', 'KREDITY']
  grades

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData('Attendance')
    this.dataService.getData('Admissions')
    this.dataService.getData('Students')
    this.dataService.getData('Grades')

    this.attendanceSubscription = this.dataService.getAttendanceUpdateListener()
      .subscribe(
        (data: AttendanceElement[]) => {
          this.attendance = new MatTableDataSource<AttendanceElement>(data)
          this.attendance.paginator = this.attendancePaginator
          this.attendance.sort = this.sort
        }
      )

    this.admissionsSubscription = this.dataService.getAdmissionsUpdateListener()
        .subscribe(
          (data: any[]) => {
            this.admissions = new MatTableDataSource<any[]>(data)
            this.admissions.paginator = this.admissionsPaginator
            this.admissions.sort = this.sort
          }
        )

    this.gradesSubscription = this.dataService.getGradesUpdateListener()
      .subscribe(
        (data: GradeElement[]) => {
          this.grades = new MatTableDataSource<GradeElement>(data)
          this.grades.paginator = this.gradesPaginator
          this.grades.sort = this.sort
        }
      )

    this.studentsSubscription = this.dataService.getStudentsUpdateListener()
        .subscribe(
          (data: StudentElement[]) => {
            this.students = new MatTableDataSource<StudentElement>(data)
            this.students.paginator = this.studentsPaginator
            this.students.sort = this.sort
          }
        )
  }

  applyFilter(filterValue: string) {
    this.attendance.filter = filterValue.trim().toLowerCase()
  }

  ngOnDestroy() {
    this.attendanceSubscription.unsubscribe()
    this.admissionsSubscription.unsubscribe()
    this.studentsSubscription.unsubscribe()
    this.gradesSubscription.unsubscribe()
  }
}

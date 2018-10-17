import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface AttendanceElement {
  AIS_ID: number;
  KOD: string;
  OBDOBIE: string;
  PREDMET: string;
  PORADI: number;
  ROZVRHOVA_AKCIA: string;
  ROZVRHOVA_AKCIA_ID: number;
  UCAST: string;
  UCAST_ID: number;
}

export interface StudentElement {
  AIS_ID: number;
  PRIEZVISKO: string;
  MENO: string;
  STUDIUM: string;
  ROCNIK: number;
}

export interface GradeElement {
  AIS_ID: number;
  RCS: string;
  KOD: string;
  PREDMET: string;
  ZAP_VYSLEDOK: string;
  PREDMET_VYSLEDOK: string;
  POCET_ZAPISOV: number;
  KREDITY: number;
}

@Component({
  selector: 'app-data-tables',
  templateUrl: './data-tables.component.html',
  styleUrls: ['./data-tables.component.css']
})
export class DataTablesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  attendanceSubscription: Subscription;
  studentsSubscription: Subscription;
  gradesSubscription: Subscription;

  // Attendance table
  displayedAttendanceColumns: string[] = ['AIS_ID', 'KOD', 'OBDOBIE', 'PORADI', 'PREDMET', 'ROZVRHOVA_AKCIA', 'ROZVRHOVA_AKCIA_ID', 'UCAST', 'UCAST_ID'];
  attendance;

  // Students table
  displayedStudentsColumns: string[] = ['AIS_ID', 'MENO', 'PRIEZVISKO', 'STUDIUM', 'ROCNIK'];
  students;

  // Grades table
  displayedGradesColumns: string[] = ['AIS_ID', 'RCS', 'KOD', 'PREDMET', 'ZAP_VYSLEDOK', 'PREDMET_VYSLEDOK', 'POCET_ZAPISOV', 'KREDITY'];
  grades;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData('Attendance');
    this.dataService.getData('Students');
    this.dataService.getData('Grades');

    this.attendanceSubscription = this.dataService.getAttendanceUpdateListener()
      .subscribe(
        (data: AttendanceElement[]) => {
          this.attendance = new MatTableDataSource<AttendanceElement>(data);
          this.attendance.paginator = this.paginator;
          this.attendance.sort = this.sort;
        }
      );

    this.gradesSubscription = this.dataService.getGradesUpdateListener()
      .subscribe(
        (data: GradeElement[]) => {
          this.grades = new MatTableDataSource<GradeElement>(data);
          this.grades.paginator = this.paginator;
          this.grades.sort = this.sort;
        }
      );

    this.studentsSubscription = this.dataService.getStudentsUpdateListener()
        .subscribe(
          (data: StudentElement[]) => {
            this.students = new MatTableDataSource<StudentElement>(data);
            this.students.paginator = this.paginator;
            this.students.sort = this.sort;
          }
        );
  }

  ngOnDestroy() {
    this.attendanceSubscription.unsubscribe();
    this.studentsSubscription.unsubscribe();
    this.gradesSubscription.unsubscribe();
  }
}

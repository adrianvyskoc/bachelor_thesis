import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { MatDialog } from '@angular/material';
import { DiplomaDialogComponent } from './diploma-dialog/diploma-dialog.component';
import { ListDiplomasDialogComponent } from './listDiplomas-dialog/listDiplomas-dialog.component';

import { ExportService } from 'src/app/plugins/utils/export.service';

import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { Title } from '@angular/platform-browser';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit, OnDestroy {
  
  @ViewChild('paginator', {static: false}) paginator: MatPaginator
  @ViewChild('admSort', {static: false}) admSort: MediaStreamErrorEventInit

  showFilter = true
  showLabels = false
  subscription: Subscription
  admissions
  filteredAdmissions = []
  displayedAdmissionsColumns = ['AIS_ID', 'Meno', 'Priezvisko', 'OBDOBIE', 'Prijatie_na_program', 'Exb_celk']
  displayedAdmissionsColumnsHeader = ['AIS ID', 'Meno', 'Priezvisko', 'Rok prijatia', 'Študijný program', 'Body za diplomy']
  years = []
  programs = []

  selectedYear: string = 'all'
  selectedProgram: string = 'all'
  
  
  lastNYears: number
  schoolYears = []

  schoolYearsFiltered = []

  

  /*
  name: string = ''
  allDataAdmissions: any = []
  students: any = []*/
  countS
  countBez
  countBezNull 
  countAll

  ciselkoS
  ciselkoAll
  ciselkoBez
  ciselkoBezNull

  
  
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private tocUtil: TocUtil,
    private exportService: ExportService,
    private titleService: Title
  ) { }

  _displayedColumnsAndActions() {
    return [...this.displayedAdmissionsColumns, 'Diplom']
  }

  openDiplomaDialog(student) {
    const dialogRef = this.dialog.open(DiplomaDialogComponent, {
      width: '600px',
      data: {
        student
      }
    })
  }

  openListDiplomasDialog(student) {
    this.dialog.open(ListDiplomasDialogComponent, {
      width: '800px',
      data: {
        student
      }
    })
  }

  ngOnInit() {      
    this.titleService.setTitle("Prijímacie konanie - Pridávanie diplomov")
    this.tocUtil.createToc()
    this.dataService.getStudentsBachelor()
    this.subscription = this.dataService.getStudentsBachelorUpdateListener()
      .subscribe(
        (data:any[]) => {
          this.filteredAdmissions = data['allDataAdmissions']
          this.years = data["years"].rows.map(year => year.OBDOBIE).sort();
          this.programs = data["programs"];
          this.countS = data["countS"];
          this.countBez = data["countBez"];
          this.countBezNull = data["countBezNull"];
          this.countAll = data["countAll"];
          this.admissions = new MatTableDataSource<any[]>(data['allDataAdmissions'])
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

  switchTabs() {
    this.showFilter = !this.showFilter;
    this.showLabels = !this.showLabels;
  }

  

  onYearSelect() {
    this.dataService.setYear(this.selectedYear)

    this.titleService.setTitle("Prijímacie konanie - Pridávanie diplomov")
    this.tocUtil.createToc()
    this.dataService.getStudentsBachelor()
    this.subscription = this.dataService.getStudentsBachelorUpdateListener()
      .subscribe(
        (data:any[]) => {
          this.filteredAdmissions = data['allDataAdmissions']
          this.years = data["years"].rows.map(year => year.OBDOBIE).sort();
          this.programs = data["programs"];
          this.admissions = new MatTableDataSource<any[]>(data['allDataAdmissions'])
          this.admissions.paginator = this.paginator
          this.admissions.sort = this.admSort
        }
      )
  }


  onProgramSelect() {
    this.dataService.setProgram(this.selectedProgram)

    this.titleService.setTitle("Prijímacie konanie - Pridávanie diplomov")
    this.tocUtil.createToc()
    this.dataService.getStudentsBachelor()
    this.subscription = this.dataService.getStudentsBachelorUpdateListener()
      .subscribe(
        (data:any[]) => {
          this.filteredAdmissions = data['allDataAdmissions']
          this.years = data["years"].rows.map(year => year.OBDOBIE).sort();
          this.programs = data["programs"];
          this.admissions = new MatTableDataSource<any[]>(data['allDataAdmissions'])
          this.admissions.paginator = this.paginator
          this.admissions.sort = this.admSort
        }
      )   
  }

  

  onlastNYearsChange() {
    
    this.schoolYears = this.years

    this.ciselkoS = this.countS[0].count
    this.ciselkoBez = this.countBez[0].count
    this.ciselkoBezNull = this.countBezNull[0].count
    this.ciselkoAll = this.countAll[0].count

    this.schoolYearsFiltered = this.lastNYears
      ? this.schoolYears.slice(this.schoolYears.length - this.lastNYears)
      : this.schoolYears
  }

  



  // povodne funkcie--------------------------------------------------------------

  /*onClick() {
    this.dataService.getStudentsName(this.name)
      .subscribe((data) => {
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"];
        this.programs = data["programs"];
      });
  }
  onClickAll() {

    this.dataService.setProgram("all")
    this.dataService.setYear("all")

    this.titleService.setTitle("Prijímacie konanie - Pridávanie diplomov")
    this.tocUtil.createToc()
    this.dataService.getStudentsBachelor()
    this.subscription = this.dataService.getStudentsBachelorUpdateListener()
      .subscribe(
        (data:any[]) => {
          this.filteredAdmissions = data['allDataAdmissions']
          this.years = data["years"].rows.map(year => year.OBDOBIE).sort();
          this.programs = data["programs"];
          this.admissions = new MatTableDataSource<any[]>(data['allDataAdmissions'])
          this.admissions.paginator = this.paginator
          this.admissions.sort = this.admSort
        }
      )
    /*this.dataService.getStudents()
      .subscribe((data) => {
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"];
        this.programs = data["programs"];
        /*this.countS = data["countS"];
        this.countBez = data["countBez"];
        this.countAll = data["countAll"];
      });
  }*/
}

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { MatDialog } from '@angular/material';
import { DiplomaDialogComponent } from './diploma-dialog/diploma-dialog.component';
import { ListDiplomasDialogComponent } from './listDiplomas-dialog/listDiplomas-dialog.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  selectedYear: string = 'all'
  selectedProgram: string = 'all'
  admissions = []

  name: string = ''
  allDataAdmissions: any = []
  students: any = []
  years = []
  programs = []
  countS
  countBez
  countBezNull 
  countAll

  constructor(
    private dataService: DataService,
    public dialog: MatDialog
  ) { }

  

  openDiplomaDialog(student) {
    const dialogRef = this.dialog.open(DiplomaDialogComponent, {
      width: '500px',
      data: {
        student
      }
    })
  }

  openListDiplomasDialog(student) {
    this.dialog.open(ListDiplomasDialogComponent, {
      width: '900px',
      data: {
        student
      }
    })
  }

  ngOnInit() {
    this.dataService.getStudents()
      .subscribe((data) => {
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"];
        this.programs = data["programs"];
        /*this.countS = data["countS"];
        this.countBez = data["countBez"];
        this.countBezNull = data["countBezNull"];
        this.countAll = data["countAll"];*/
        this.years.sort();

        console.log(this.years)
        debugger
    });


    /*
    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        labels: ['Data1','Data2'],
        datasets: [
          { 
            data: [50, this.countS ],
            backgroundColor: ['rgba(255, 0, 0, 1)','rgba(255, 0, 0, 0.1)'],
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        tooltips:{
          enabled:false
        }
      }
    });*/
    
  }


  onClick() {
    this.dataService.getStudentsName(this.name)
      .subscribe((data) => {
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"];
        this.programs = data["programs"];
      });
  }
  onClickAll() {
    this.dataService.getStudents()
      .subscribe((data) => {
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"];
        this.programs = data["programs"];
        /*this.countS = data["countS"];
        this.countBez = data["countBez"];
        this.countAll = data["countAll"];*/
      });
  }

  onYearSelect() {
    this.dataService.setYear(this.selectedYear)

    this.dataService.getStudents()
      .subscribe((data) => {
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"];
        this.programs = data["programs"];
        /*this.countS = data["countS"];
        this.countBez = data["countBez"];
        this.countAll = data["countAll"];*/
      }
    );
  }


  onProgramSelect() {
    this.dataService.setProgram(this.selectedProgram)

    this.dataService.getStudents()
      .subscribe((data) => {
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"];
        this.programs = data["programs"];
        /*this.countS = data["countS"];
        this.countBez = data["countBez"];
        this.countAll = data["countAll"];*/
      }
    );    
  }
}

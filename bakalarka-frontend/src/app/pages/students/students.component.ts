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
  admissions = []

  name: string = ''
  allDataAdmissions: any = []
  students: any = []
  years = []

  constructor(
    private dataService: DataService,
    public dialog: MatDialog
  ) { }

  openDiplomaDialog(student) {
    this.dialog.open(DiplomaDialogComponent, {
      width: '500px',
      data: {
        student
      }
    })
  }

  openListDiplomasDialog(student) {
    this.dialog.open(ListDiplomasDialogComponent, {
      width: '500px',
      data: {
        student
      }
    })
  }

  ngOnInit() {
    this.dataService.getStudents()
      .subscribe((data) => {
        this.students = data["students"];
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"].rows;
      });
  }

  onClick() {
    this.dataService.getStudents(this.name)
      .subscribe((data) => {
        this.students = data["students"];
        this.years = data["years"].rows;
        this.allDataAdmissions = data["allDataAdmissions"].rows;
      });
  }

  onYearSelect() {
    this.dataService.setYear(this.selectedYear)
  }

  
  

}

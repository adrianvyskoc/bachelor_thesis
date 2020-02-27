import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { MatDialog } from '@angular/material';
import { DiplomaDialogComponent } from './diploma-dialog/diploma-dialog.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  name: string = ''

  students: any = []
  years = []
  //displayedColumns: string[] = ['MENO', 'PRIEZVISKO'];

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

  ngOnInit() {
    this.dataService.getStudents()
      .subscribe((data) => {
        this.students = data["students"];
        this.years = data["years"].rows;
      });
  }

  onClick() {
    console.log("klik")
    this.dataService.getStudents(this.name)
      .subscribe((students) => {
        this.students = students;
      });
  }

}

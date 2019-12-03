import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  name: string = ''

  students: any = []
  displayedColumns: string[] = ['MENO', 'PRIEZVISKO'];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getStudents()
      .subscribe((students) => {
        this.students = students;
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

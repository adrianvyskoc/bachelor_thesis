import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  id: number
  student = {}
  grades = {}
  admissions = []

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.dataService.getStudent(this.id)
      .subscribe(
        data => {
          console.log(data)
          this.student = data['student']
          this.grades = data['grades']
          this.admissions = data['admissions']
        }
      );
  }
}

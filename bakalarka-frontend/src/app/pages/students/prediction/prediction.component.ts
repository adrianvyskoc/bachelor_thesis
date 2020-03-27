import { Component, OnInit, ViewChild } from '@angular/core';
import { PredictionService } from './prediction.service';
import { FormControl } from '@angular/forms';
import { IRiskyStudent } from './IRiskyStudent';
import { IResponse } from './IResponse';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  school_year = new FormControl('');
  selected_subject = ''
  imported_subjects: any = []
  text = 'Veronika'
  pozn = ""

  displayed_columns: string [] = ['id', 'meno', 'priezvisko'];
  public risky_students: IRiskyStudent[]
  //data_source_risky_students = new MatTableDataSource<IRiskyStudent>(this.risky_students)
  data_source_risky_students : MatTableDataSource<IRiskyStudent>

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(
    private dataService: PredictionService
  ) { }

  ngOnInit() {
    this.dataService.get_subjects()
    .subscribe (
      (data) => this.imported_subjects = data
    )

    
  }


  start_prediction() {
    this.dataService.predict(this.school_year.value, this.selected_subject)
    .subscribe( 
      (data: IResponse) => {
          this.risky_students = data.list
          this.data_source_risky_students = new MatTableDataSource<IRiskyStudent>(this.risky_students)
          this.data_source_risky_students.paginator = this.paginator;
    }
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data_source_risky_students.filter = filterValue.trim().toLowerCase();
  }

  communicatePython() {
    this.pozn = "som tu"
    this.dataService.helloPython()
    .subscribe(data => {
      this.pozn = "dostala som data"
      this.text = "hhh"
      if (data == null) {
        this.text = 'nulll'
      }
      this.text = data['odpoved']
      console.log(data)
    })
    
  }

}

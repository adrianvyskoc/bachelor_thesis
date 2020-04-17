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
  selected_model
  available_models: any = []
  show_models = false


  displayed_columns: string [] = ['id', 'meno', 'priezvisko'];
  data_source_risky_students : MatTableDataSource<IRiskyStudent>

  risky_students: IRiskyStudent []
  

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

  onFormChange() {

    // pri celkovej predikcii tiez moze byt viac modelov 
    if (this.selected_subject != 'Celková predikcia') {
      this.dataService.get_models(this.selected_subject)
      .subscribe (
        (data) => {
          this.available_models = data
          this.show_models = true
        } 
      )
    }
    else if (this.selected_subject == 'Celková predikcia') {
      this.show_models = false
    }
  }

  start_prediction() {
    this.dataService.predict(this.school_year.value, this.selected_model.id)
    .subscribe( 
      (data) => {
        this.risky_students = data
        this.data_source_risky_students = new MatTableDataSource<IRiskyStudent>(this.risky_students)
        this.data_source_risky_students.paginator = this.paginator;
      }
    )
  }

  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data_source_risky_students.filter = filterValue.trim().toLowerCase();
  }

 

}

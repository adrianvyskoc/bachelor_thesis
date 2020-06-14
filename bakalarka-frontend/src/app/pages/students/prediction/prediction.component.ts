import { Component, OnInit, ViewChild } from '@angular/core';
import { PredictionService } from './prediction.service';
import { FormControl, Validators } from '@angular/forms';
import { IRiskyStudent } from './IRiskyStudent';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/plugins/utils/export.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  public myreg = /[0-9]{4}-[0-9]{4}/
  school_year: FormControl
  selected_subject = ''
  imported_subjects: any = []
  selected_model
  available_models: any = []
  show_models = false
  loading = false
  showErrorMessage = false
  showSuccessMessage = false

  ErrorMessage = ''

  model_details


  displayed_columns: string [] = ['id', 'meno', 'priezvisko'];
  data_source_risky_students : MatTableDataSource<IRiskyStudent>

  risky_students: IRiskyStudent []
  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(
    private dataService: PredictionService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.school_year = new FormControl('');
    this.dataService.get_subjects()
    .subscribe (
      (data) => this.imported_subjects = data
    )

    if(this.dataService.subsVarPrediction==undefined) {
      this.dataService.subsVarPrediction = this.dataService.invokeRefreshModelPrediction.subscribe(
        (data) => {
          this.dataService.get_subjects()
            .subscribe (
              (data) =>  {
                this.imported_subjects = data
                this.selected_subject = ''
                this.show_models = false
                this.risky_students = undefined
                this.model_details = undefined
              }
    )
        },
        (error) => {
          
        }
      )
    }

    
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

  // markTouched() {
  //   this.school_year.markAsTouched();
  //   this.school_year.updateValueAndValidity();
  // }

  // getErrorMessage() {
  //   return this.school_year.hasError('email') ? 'Not a valid url' :
  //       '';
  // }

  start_prediction() {
    this.showErrorMessage = false
    this.risky_students = null
    this.dataService.predict(this.school_year.value, this.selected_model.id)
    .subscribe( 
      (data) => {
        this.risky_students = data
        this.data_source_risky_students = new MatTableDataSource<IRiskyStudent>(this.risky_students)
        this.data_source_risky_students.paginator = this.paginator;
        this.dataService.get_model_details(this.selected_model.id)
        .subscribe(
        (data) => {
          this.model_details = data
        },
        error => {}
      )
      },
      (error) => {
        console.error(error)
        this.ErrorMessage = error.error
               
        this.loading = false
        this.showErrorMessage = true
      }
    )
  }

  export_data_excel() {
    this.exportService.exportArrayOfObjectToExcel(this.risky_students, 'export_' + this.school_year.value + '_' + this.selected_subject + '_' + this.selected_model.name);
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data_source_risky_students.filter = filterValue.trim().toLowerCase();
  }

 

}

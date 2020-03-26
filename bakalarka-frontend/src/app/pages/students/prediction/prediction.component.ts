import { Component, OnInit } from '@angular/core';
import { PredictionService } from './prediction.service';
import { FormControl } from '@angular/forms';
import { IRiskyStudent } from './IRiskyStudent';
import { IResponse } from './IResponse';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  school_year = new FormControl('');
  selected_subject = ''
  imported_models = ["Matematická analýza", "Vsetko"]
  text = 'Veronika'
  pozn = ""

  displayed_columns: string [] = ['id', 'meno', 'priezvisko'];
  public risky_students: IRiskyStudent[]
  
  constructor(
    private dataService: PredictionService
  ) { }

  ngOnInit() {
  }


  start_prediction() {
    this.dataService.predict(this.school_year.value, this.selected_subject)
    .subscribe(
      (data: IResponse) => this.risky_students = data.list
      )

    this.text = this.school_year.value
    //this.pozn = this.selected_subject.value
    this.pozn = this.selected_subject
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

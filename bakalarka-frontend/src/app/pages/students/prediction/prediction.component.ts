import { Component, OnInit } from '@angular/core';
import { PredictionService } from './prediction.service';
import { FormControl } from '@angular/forms';

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
  
  constructor(
    private dataService: PredictionService
  ) { }

  ngOnInit() {
  }


  start_prediction() {
    this.dataService.predict(this.school_year.value, this.selected_subject)
    .subscribe(data => {
      this.pozn = "mam odpoved"
    })

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

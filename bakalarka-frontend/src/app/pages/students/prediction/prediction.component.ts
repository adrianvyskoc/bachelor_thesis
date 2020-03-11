import { Component, OnInit } from '@angular/core';
import { PredictionService } from './prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  public school_year: string;
  selected_subject = ""
  imported_models = ["Matematicka analyza", "Vsetko"]
  text = 'Veronika'
  pozn = ""
  
  constructor(
    private dataService: PredictionService
  ) { }

  ngOnInit() {
  }


  start_prediction() {
    this.text = this.school_year
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

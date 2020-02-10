import { Component, OnInit } from '@angular/core';
import { PredictionService } from './prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  text = 'Veronika'
  pozn = ""
  
  constructor(
    private dataService: PredictionService
  ) { }

  ngOnInit() {
  }

  communicatePython() {
    this.pozn = "som tu"
    this.dataService.helloPython()
    .subscribe(data => {
      this.pozn = "dostala som data"
      this.text = data.toString()
    })
    
  }

}

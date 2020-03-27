import { Component, OnInit } from '@angular/core';
import { PredictionService } from 'src/app/pages/students/prediction/prediction.service'

@Component({
  selector: 'app-model-import',
  templateUrl: './model-import.component.html',
  styleUrls: ['./model-import.component.scss']
})
export class ModelImportComponent implements OnInit {

  constructor(
    private dataService: PredictionService
  ) { }

  available_models

  ngOnInit() {
    this.dataService.get_all_models()
    .subscribe (
      (data) => this.available_models = data
    )
  }

}

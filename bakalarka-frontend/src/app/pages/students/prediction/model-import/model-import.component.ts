import { Component, OnInit } from '@angular/core';
import { PredictionService } from 'src/app/pages/students/prediction/prediction.service'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver';
import { PredictionComponent } from '../prediction.component';

@Component({
  selector: 'app-model-import',
  templateUrl: './model-import.component.html',
  styleUrls: ['./model-import.component.scss']
})
export class ModelImportComponent implements OnInit {

  constructor(
    private dataService: PredictionService
  ) { }

  available_models: any = []
  model
  imputers
  selectedFile : File
  fileName : string

  showErrorDelete = false
  showSuccessDelete = false

  new_model
  new_imputers: any []

  model_details
  showDetails = false

  serverError = false



  ngOnInit() {
    this.get_all_models()
    if(this.dataService.subsVar==undefined) {
      this.dataService.subsVar = this.dataService.invokeRefreshModelImport.subscribe(
        (data) => {
          this.get_all_models()
        },
        (error) => {
          this.serverError = true
        }
      )
    }
  }

  get_all_models() {
    this.dataService.get_all_models()
    .subscribe (
      (data) => this.available_models = data,
      (error) => this.serverError = true
    )
  }

  download_model(selected_model) {
    let model_id = selected_model.id
    let imputers:any = []
    var zip = new JSZip()

   this.dataService.get_model(model_id)
    .subscribe (
      (data) => {
        this.model = data
        console.log(this.model)
        this.dataService.get_imputers(model_id).
        subscribe (
          (data1) => {
            zip.file('model.json', JSON.stringify(this.model))
            zip.folder('imputers')
            imputers = data1
            imputers.forEach(imputer => {
              console.log(imputer)
              zip.folder('imputers').file(imputer.column_name + ".json", JSON.stringify(imputer))
            });
            zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
              saveAs(blob, "model.zip");                          // 2) trigger the download
            });
          }
        )
        
      }
    )
  }

  delete_model(selected_model) {
    let model_id = selected_model.id

    this.dataService.delete_model(model_id)
    .subscribe (
      (data) => {  
        this.refresh_form()
        this.showSuccessDelete = true

        setTimeout(() => {
          this.showSuccessDelete = false
        }, 5000)

      }, // success path
      error => {
        console.log(error)
        this.showErrorDelete = true

        setTimeout(() => {
          this.showErrorDelete = false
        }, 5000)
      } // error path
    )
  }

  open_model_details(selected_model) {
    let model_id = selected_model.id
    this.dataService.get_model_details(model_id)
    .subscribe ( 
      (data) => {
        this.model_details = data
        this.showDetails = true
        console.log(this.model_details)
      },
      error => {

      }
    )
  }

  

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0]
    this.fileName = event.target.files[0] ? event.target.files[0].name : ""
    console.log(this.fileName)

    let new_model: any
    let new_imputers: any = []
    let models_in = this.available_models
    console.log(models_in)

    var zip = new JSZip();

    zip.loadAsync(this.selectedFile)
    .then(function(contents) {
      console.log(contents)
      Object.keys(contents.files).forEach((filename)=> {
       this.handleFile(filename)       
      })
      console.log(new_model)
      console.log(new_imputers)
    })


  
  }

  handleFile(filename) {
    console.log(filename)
    if (filename != 'imputers/') {

    var zip = new JSZip()
    zip.file(filename).async('string').then( function(content) {
      var searchPattern = new RegExp('^imputers/')
      if (searchPattern.test(filename)) {
        let imputer = JSON.parse(content)
        this.new_imputers.push(imputer[0])
      }
      else {
        console.log("SOM TU")
        this.new_model = JSON.parse(content)
        console.log(this.new_model)
        this.available_models.forEach(element => {
          if (element.name == this.new_model[0].name) {
            this.showError = true
            console.log("ERROR")
            return
          }
        });
      }
    })
  }
  }


  refresh_form() {
    this.dataService.get_all_models()
    .subscribe (
      (data) => this.available_models = data
    )

  }

}

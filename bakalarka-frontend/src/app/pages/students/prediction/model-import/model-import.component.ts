import { Component, OnInit } from '@angular/core';
import { PredictionService } from 'src/app/pages/students/prediction/prediction.service'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver';
import { PredictionComponent } from '../prediction.component';
import { zip } from 'rxjs';

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
  selectedFile: File
  fileName: string

  //import_disabled = true

  showErrorFile = false
  showErrorDelete = false
  showSuccessDelete = false
  showErrorName = false
  showErrorImport = false
  showSuccesImport = false

  new_model: any = null
  new_imputers: any = []

  model_details
  showDetails = false

  serverError = false

  map = new Map<string, string>()


  ngOnInit() {

    this.map.set("ais_admissions", "prijímacie konanie")
    this.map.set("ineko_percentils", "INEKO percentily")
    this.map.set("ineko_additional_data", "INEKO doplnkové údaje")
    this.map.set("ineko_total_ratings", "INEKO celkové hodnotenie")
    this.map.set("ineko_schools", "INEKO školy")
    this.map.set("entry_tests", "Vstupné testy")

    this.get_all_models()
    if (this.dataService.subsVar == undefined) {
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
      .subscribe(
        (data) => this.available_models = data,
        (error) => this.serverError = true
      )
  }

  download_model(selected_model) {
    let model_id = selected_model.id
    let imputers: any = []
    var zip = new JSZip()

    this.dataService.get_model(model_id)
      .subscribe(
        (data) => {
          this.model = data
          this.dataService.get_imputers(model_id).
            subscribe(
              (data1) => {
                zip.file('model.json', JSON.stringify(this.model))
                zip.folder('imputers')
                imputers = data1
                imputers.forEach(imputer => {
                  zip.folder('imputers').file(imputer.column_name + ".json", JSON.stringify(imputer))
                });
                zip.generateAsync({ type: "blob" }).then(function (blob) {
                  saveAs(blob, "model.zip");
                });
              }
            )

        }
      )
  }

  delete_model(selected_model) {
    let model_id = selected_model.id

    this.dataService.delete_model(model_id)
      .subscribe(
        (data) => {
          // this.refresh_form()
          this.showSuccessDelete = true
          this.dataService.RefreshAvailableModels()

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
      .subscribe(
        (data) => {
          this.model_details = data
          let used_tables = this.model_details.used_tables.split(',')
          console.log(used_tables)
          for (var i = 0; i< used_tables.length; i+=1) {
            used_tables[i] = this.map.get(used_tables[i])
            this.model_details.used_tables = used_tables.join(',')
          }
          
          this.showDetails = true
          console.log(this.model_details)
        },
        error => {

        }
      )
  }

  

  onFileSelected(event) {
    this.new_model = null
    this.showErrorFile = false
    this.showErrorName = false
    this.showErrorImport = false
    this.showSuccesImport = false

    this.selectedFile = <File>event.target.files[0]
    this.fileName = event.target.files[0] ? event.target.files[0].name : ""
    var searchPattern = new RegExp('.zip$')
    if (!searchPattern.test(this.fileName)) {
      this.showErrorFile = true
    }  

   
    var jszip = require('jszip')

    var _this = this
    jszip.loadAsync(this.selectedFile)
      .then(function (contents) {
        Object.keys(contents.files).forEach(function (filename) {
          contents.files[filename].async('string').then(function (fileData) {
            //console.log(fileData)
            if (filename != 'imputers/') {
              var searchPattern = new RegExp('^imputers/')
              if (searchPattern.test(filename)) {
                let imputer = JSON.parse(fileData)
                //ModelImportComponent.new_imputers.push(imputer)
                _this.new_imputers.push(imputer)
              }
              else {
                let model = JSON.parse(fileData)
                _this.new_model = model

              }
            }
          })
        })
      })



  }

  addModel() {

   
    //kontrola mena
    for (var i = 0; i < this.available_models.length; i+=1)
    {
      if (this.available_models[i].name == this.new_model[0].name) {
        this.showErrorName = true
        return
      }
    }

    //var model_imputers = Object.assign(this.new)
    this.dataService.insert_model(this.new_model[0], this.new_imputers).subscribe( 
      data => {
        this.showSuccesImport = true
        //this.fileInput.nativeElement.value = ""
        this.dataService.RefreshAvailableModels()
        setTimeout(() => {
          this.showSuccesImport = false
        }, 5000)
      },
      (error) => {
        this.showErrorImport = true
        setTimeout(() => {
          this.showErrorImport = false
        }, 5000)
      })
  }

 


  refresh_form() {
    this.dataService.get_all_models()
      .subscribe(
        (data) => this.available_models = data
      )

  }

}

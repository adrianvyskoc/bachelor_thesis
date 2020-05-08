import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Form, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PredictionService } from '../prediction.service';
import {MatSelectionList, MatListOption} from '@angular/material/list';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.scss']
})
export class ModelCreateComponent implements OnInit {
  @ViewChild('list_years', {static: false}) private list_years: MatSelectionList; 
  @ViewChild('list_tables', {static: false}) private list_tables: MatSelectionList; 

  //new_model: FormGroup
  name_of_model = new FormControl('', [Validators.required])
  years: FormGroup
  tables: FormGroup
  subjects: FormControl
  

  //z databazy
  available_years: any = []
  available_tables: any = []
  all_subjects: any = []
  entry_tests_years: any = []

  complete_form = false

  selected_subject = ''
  selected_name = ''

  selectedYears: string[] = []
  selectedTables: string[] = []

  map = new Map<string, string>()


  serverError = false


  constructor(private fb: FormBuilder, private dataService: PredictionService) {

   }

  


  // new_model = new FormGroup( {
  //   name_of_model: new FormControl(''),
  //   years: FormGroup
  // })

  ngOnInit() {

    if (this.dataService.subsVarReset == undefined) {
      this.dataService.subsVarReset = this.dataService.invokeResetForm.subscribe(
        (data)=>{
          this.list_tables.deselectAll()
          this.list_years.deselectAll()
          this.name_of_model.reset()
          this.subjects.reset()
        }
      )
    }

    this.map.set("ais_admissions", "prijímacie konanie")
    this.map.set("ineko_percentils", "INEKO percentily")
    this.map.set("ineko_additional_data", "INEKO doplnkové údaje")
    this.map.set("ineko_total_ratings", "INEKO celkové hodnotenie")
    this.map.set("ineko_schools", "INEKO školy")
    this.map.set("entry_tests", "Vstupné testy")

    

    //this.available_years = ['2017-2018', '2018-2019']

    this.dataService.get_data_for_create_form().subscribe(
      (data) => {
        this.available_years = data[0];
        this.available_tables = data[1];
        this.all_subjects = data[2]
        this.entry_tests_years = data[3]

        this.years = this.fb.group( {
            available_years: this.fb.array([])
          })
        this.tables= this.fb.group( {
            available_tables: this.fb.array([])
          })
        
        this.subjects = new FormControl('')
    
    
        this.complete_form = true
      },
      (error) => {
        this.serverError = true
      }
    )

    
    // const formControls_years = this.available_years.map(control => new FormControl(false));


    // this.new_model = new FormGroup ( {
    //   name_of_model: new FormControl(''),
    //   years: this.fb.group( {
    //     available_years: new FormArray(formControls_years)
    //   })
    // })
    
 
  }

  onSubmit() {
    console.log(this.selectedYears)
    console.log(this.selectedTables)
    this.selected_name = this.name_of_model.value
    this.selected_subject = this.subjects.value
    
    // const selected_years = this.years.get('available_years').value
    // const selected_tables = this.tables.get('available_tables').value

    // console.log(this.selected_name + this.selected_subject + selected_years + selected_tables)

    this.dataService.create_model(this.selected_name, this.selected_subject, this.selectedYears, this.selectedTables)
  
    this.dataService.loading = true
    
  }

  selectAllYears(){
    this.list_years.selectAll();
  }

  selectAllTables() {
    this.list_tables.selectAll();
  }

  // onChange_years(event) {
  //   const available_years = <FormArray>this.years.get('available_years') as FormArray

  //   if(event.checked) {
  //     available_years.push(new FormControl(event.source.value))
  //   } else {
  //     const i = available_years.controls.findIndex(x => x.value === event.source.value);
  //     available_years.removeAt(i);
  //   }
  // }

  // onChange_tables(event) {
  //   const available_tables = <FormArray>this.tables.get('available_tables') as FormArray

  //   if(event.checked) {
  //     available_tables.push(new FormControl(event.source.value))
  //   } else {
  //     const i = available_tables.controls.findIndex(x => x.value === event.source.value);
  //     available_tables.removeAt(i);
  //   }
  // }

  // reset_form() {
    
  //   this.ngOnInit()
  //   //vsetko odznacit
  // }

 
}

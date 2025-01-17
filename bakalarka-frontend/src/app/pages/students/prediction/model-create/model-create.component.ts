import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Form, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PredictionService } from '../prediction.service';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.scss']
})
export class ModelCreateComponent implements OnInit {

  //new_model: FormGroup
  name_of_model = new FormControl('', [Validators.required])
  years: FormGroup
  tables: FormGroup
  subjects: FormControl

  //z databazy
  available_years: any = []
  available_tables: any = []
  all_subjects: any = []

  complete_form = false

  selected_subject = ''
  selected_name = ''

  serverError = false


  constructor(private fb: FormBuilder, private dataService: PredictionService) {

   }

  


  // new_model = new FormGroup( {
  //   name_of_model: new FormControl(''),
  //   years: FormGroup
  // })

  ngOnInit() {

    //this.available_years = ['2017-2018', '2018-2019']

    this.dataService.get_data_for_create_form().subscribe(
      (data) => {
        this.available_years = data[0];
        this.available_tables = data[1];
        this.all_subjects = data[2]

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
    this.selected_name = this.name_of_model.value
    this.selected_subject = this.subjects.value
    const selected_years = this.years.get('available_years').value
    const selected_tables = this.tables.get('available_tables').value

    console.log(this.selected_name + this.selected_subject + selected_years + selected_tables)

    this.dataService.create_model(this.selected_name, this.selected_subject, selected_years, selected_tables)
    this.dataService.loading = true
    
  }

  onChange_years(event) {
    const available_years = <FormArray>this.years.get('available_years') as FormArray

    if(event.checked) {
      available_years.push(new FormControl(event.source.value))
    } else {
      const i = available_years.controls.findIndex(x => x.value === event.source.value);
      available_years.removeAt(i);
    }
  }

  onChange_tables(event) {
    const available_tables = <FormArray>this.tables.get('available_tables') as FormArray

    if(event.checked) {
      available_tables.push(new FormControl(event.source.value))
    } else {
      const i = available_tables.controls.findIndex(x => x.value === event.source.value);
      available_tables.removeAt(i);
    }
  }

  reset_form() {
    
    this.ngOnInit()
    //vsetko odznacit
  }

 
}

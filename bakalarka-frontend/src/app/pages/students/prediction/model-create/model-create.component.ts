import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Form, FormBuilder, FormArray } from '@angular/forms';
import { PredictionService } from '../prediction.service';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.scss']
})
export class ModelCreateComponent implements OnInit {

  new_model: FormGroup
  //name_of_model: FormControl
  // years: FormGroup
  // tables: FormGroup
  // subjects: FormControl

  //z databazy
  available_years: any = []
  available_tables: any = []
  all_subjects: any = []

  complete_form = false

  selected_subject
  selected_name


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

        this.new_model = new FormGroup ( {
          name_of_model: new FormControl(''),
          years: this.fb.group( {
            available_years: this.fb.array([])
          }),
          tables: this.fb.group( {
            available_tables: this.fb.array([])
          }),
          subjects: new FormControl('')
        })
    
        this.complete_form = true
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
    console.log(this.selected_subject)

    
    console.log(this.new_model.value)
  }

  onChange_years(event) {
    const available_years = <FormArray>this.new_model.controls['years'].get('available_years') as FormArray

    if(event.checked) {
      available_years.push(new FormControl(event.source.value))
    } else {
      const i = available_years.controls.findIndex(x => x.value === event.source.value);
      available_years.removeAt(i);
    }
  }

  onChange_tables(event) {
    const available_tables = <FormArray>this.new_model.controls['tables'].get('available_tables') as FormArray

    if(event.checked) {
      available_tables.push(new FormControl(event.source.value))
    } else {
      const i = available_tables.controls.findIndex(x => x.value === event.source.value);
      available_tables.removeAt(i);
    }
  }

  private make_form() {
    // const formControls_years = this.available_years.map(control => new FormControl(false));
    // const formControls_tables = this.available_tables.map(control => new FormControl(false));
    

    // this.new_model = new FormGroup ( {
    //   name_of_model: new FormControl(''),
    //   years: this.fb.group( {
    //     available_years: new FormArray(formControls_years)
    //   }),
    //   tables: this.fb.group( {
    //     available_tables: new FormArray(formControls_tables)
    //   }),
    //   subjects: new FormControl('')
    // })

    // this.complete_form = true

    this.new_model = new FormGroup ( {
      name_of_model: new FormControl(''),
      years: this.fb.group( {
        available_years: this.fb.array([])
      }),
      tables: this.fb.group( {
        available_tables: this.fb.array([])
      }),
      subjects: new FormControl('')
    })

    this.complete_form = true
  }

}

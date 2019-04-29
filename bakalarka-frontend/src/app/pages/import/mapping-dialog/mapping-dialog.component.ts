import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

export interface DialogData {
  selectedFileAttrs: [];
}

@Component({
  selector: 'app-mapping-dialog',
  templateUrl: './mapping-dialog.component.html',
  styleUrls: ['./mapping-dialog.component.scss']
})
export class MappingDialogComponent implements OnInit {

  mappingForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<MappingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    console.log(this.data.attrMapping)
    const mapping = this.data.attrMapping.reduce((acc, item) => {
      acc.push(new FormGroup({
        'from': new FormControl(item.from, Validators.required),
        'to': new FormControl(item.to, Validators.required)
      }))
      return acc
    }, [])
    this.mappingForm = new FormGroup({
      'mappings': new FormArray(mapping)
    })
  }

  onAddMapping() {
    const control = new FormGroup({
      'from': new FormControl(null, Validators.required),
      'to': new FormControl(null, Validators.required)
    });
    (<FormArray>this.mappingForm.get('mappings')).push(control)
  }

  onMappingCreate() {
    this.dialogRef.close(this.mappingForm.get('mappings').value);
  }

  onNoClick() {
    this.dialogRef.close(this.mappingForm.get('mappings').value);
  }

  onFromAttrChange(event, index) {
    this.mappingForm.get('mappings')['controls'][index].get('from').setValue(event.value)
  }

  onToAttrChange(event, index) {
    this.mappingForm.get('mappings')['controls'][index].get('to').setValue(event.value)
  }

  onRemoveMapping(index) {
    (<FormArray>this.mappingForm.get('mappings')).removeAt(index);
  }
}

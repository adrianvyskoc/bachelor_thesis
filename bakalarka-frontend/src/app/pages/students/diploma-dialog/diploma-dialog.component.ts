import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DiplomaService } from '../diploma.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/shared/data.service';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-diploma-dialog',
  templateUrl: './diploma-dialog.component.html',
  styleUrls: ['./diploma-dialog.component.scss']
})
export class DiplomaDialogComponent implements OnInit {

  diplom_typ: string = "diploma_basic"
  type: string = ""
  diploma_title: string = ""
  position: string = ""
  position_text: string = ""
  round: string = ""
  round_text: string = ""
  points
  student
  oznam = ""
  skuska = ""
  diplomasDatas: any = [];
  objectZameranies: any = [];

  bodiky

  filterForm: FormGroup

  constructor(
    private diplomaService: DiplomaService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<DiplomaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {

    this.dataService.getDiplomaData()
      .subscribe((data) => {
        this.diplomasDatas = data["diplomasData"];
        this.objectZameranies = data["objectZameranie"];
     
      });

     
     
  }

  onAddDiploma() {
    this.diplomaService.addDiploma(this.data["student"].AIS_ID, this.data["student"].OBDOBIE, this.data["student"].Prijatie_na_program, this.type, this.diploma_title, this.round, this.position)
      .subscribe((data) => {
        this.oznam = data["message"];
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddDiplomaExtra() {
    if(this.round == "iné"){
      this.round = this.round_text
    }
    if(this.position == "iné"){
      this.position = this.position_text
    }
    this.diplomaService.addDiplomaExtra(this.data["student"].AIS_ID, this.data["student"].OBDOBIE, this.data["student"].Prijatie_na_program, this.type, this.diploma_title, this.round, this.position, this.points)
      .subscribe((data) => {
        this.oznam = data["message"];
      });
    
  }

  



  

  
  
}

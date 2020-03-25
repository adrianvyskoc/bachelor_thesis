import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { DiplomaService } from '../diploma.service';

@Component({
  selector: 'app-listDiplomas-dialog',
  templateUrl: './listDiplomas-dialog.component.html',
  styleUrls: ['./listDiplomas-dialog.component.scss']
})
export class ListDiplomasDialogComponent implements OnInit {
 
  student
  oznam: string;
  aisId: string;
  ownDiplomas: any = [];

  constructor(
    private diplomaService: DiplomaService,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data1
  ) { }

  ngOnInit() {
    this.aisId = this.data1["student"].AIS_ID
    this.oznam = this.data1["student"].Meno + " " + this.data1["student"].Priezvisko


    this.dataService.getDiplomas()
      .subscribe((data) => {
        this.ownDiplomas = data["ownDiplomas"].rows;
      });
  } 
  
}

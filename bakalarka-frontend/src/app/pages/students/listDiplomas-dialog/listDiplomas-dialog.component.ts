import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { DiplomaService } from '../diploma.service';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { ExportService } from 'src/app/plugins/utils/export.service';

@Component({
  selector: 'app-listDiplomas-dialog',
  templateUrl: './listDiplomas-dialog.component.html',
  styleUrls: ['./listDiplomas-dialog.component.scss']
})
export class ListDiplomasDialogComponent implements OnInit {
 
  student
  oznam: string;
  premenna: string;
  aisId: string;
  ownDiplomas: any = [];


  constructor(
    private diplomaService: DiplomaService,
    private dataService: DataService,
    private exportService: ExportService,
    public dialogRef: MatDialogRef<ListDiplomasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data1
  ) { }

  ngOnInit() {
    this.aisId = this.data1["student"].AIS_ID
    this.oznam = this.data1["student"].Meno + " " + this.data1["student"].Priezvisko


    this.dataService.getDiplomas(this.aisId)
      .subscribe((data) => {
        this.ownDiplomas = data["ownDiplomas"];
        if(this.ownDiplomas == ""){
          this.premenna = "vypis";
        }
      });
    
  } 

  exportAll() {
    this.exportService.exportArrayOfObjectToExcel(this.ownDiplomas, 'diplomy');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  
}

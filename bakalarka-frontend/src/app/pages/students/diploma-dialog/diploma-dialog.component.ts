import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DiplomaService } from '../diploma.service';

@Component({
  selector: 'app-diploma-dialog',
  templateUrl: './diploma-dialog.component.html',
  styleUrls: ['./diploma-dialog.component.scss']
})
export class DiplomaDialogComponent implements OnInit {

  diploma_title: string = ""
  position: string = ""
  student

  constructor(
    private diplomaService: DiplomaService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  onAddDiploma() {
    console.log("dadadasdasd")
    this.diplomaService.addDiploma(this.data["student"].AIS_ID, this.diploma_title, this.position);
  }
}

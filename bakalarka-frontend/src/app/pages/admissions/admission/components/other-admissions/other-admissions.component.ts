import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-other-admissions',
  templateUrl: './other-admissions.component.html',
  styleUrls: ['./other-admissions.component.scss']
})
export class OtherAdmissionsComponent implements OnChanges {

  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  @Input() admissions

  showTable: boolean = false
  displayedAdmissionsColumns = ['id', 'Meno', 'Priezvisko', 'E_mail', 'OBDOBIE', 'Program', 'Rozh', 'created_at']

  constructor() { }

  ngOnChanges() {
    if(this.admissions) {
      this.admissions = new MatTableDataSource(this.admissions)
      this.admissions.paginator = this.paginator
      this.admissions.sort = this.sort
    }

    this.showTable = !!this.admissions
  }

  isAccepted(rozh) {
    if(rozh == 10 || rozh == 11 || rozh == 13) {
      return "Prijatý"
    } else {
      return "Neprijatý"
    }
  }

}

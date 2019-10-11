import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-other-admissions',
  templateUrl: './other-admissions.component.html',
  styleUrls: ['./other-admissions.component.scss']
})
export class OtherAdmissionsComponent implements OnChanges {

  @ViewChild('paginator', {static: false}) paginator: MatPaginator
  @ViewChild(MatSort, {static: false}) sort: MatSort

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

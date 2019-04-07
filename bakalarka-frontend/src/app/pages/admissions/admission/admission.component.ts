import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss']
})
export class AdmissionComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  id
  admission = {}
  school = {}
  pointers = {}
  otherAdmissions
  displayedAdmissionsColumns = ['id', 'Meno', 'Priezvisko', 'E_mail', 'OBDOBIE', 'Program', 'Rozh', 'created_at']

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private exportService: ExportService,
    private tocUtil: TocUtil
  ) { }

  ngOnInit() {
    this.tocUtil.createToc()
    this.id = this.route.snapshot.paramMap.get('id')
    this.dataService.getAdmission(this.id)
      .subscribe(data => {
        console.log(data)
        this.admission = data['admission']
        this.school = data['school']
        this.pointers = data['pointers'][0] || {}
        this.otherAdmissions = new MatTableDataSource(data['otherAdmissions'])

        this.otherAdmissions.paginator = this.paginator
        this.otherAdmissions.sort = this.sort
      })
  }

  exportAll() {
    const tables = document.querySelectorAll('table')
    this.exportService.exportMultipleTablesToExcel(tables, 'summary')
  }

  isAccepted(rozh) {
    if(rozh == 10 || rozh == 11 || rozh == 13) {
      return "Prijatý"
    } else {
      return "Neprijatý"
    }
  }
}

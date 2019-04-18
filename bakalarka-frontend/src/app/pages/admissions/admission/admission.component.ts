import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss']
})
export class AdmissionComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  id
  admission = {}
  school = {}
  pointers = {}
  otherAdmissions
  displayedAdmissionsColumns = ['id', 'Meno', 'Priezvisko', 'E_mail', 'OBDOBIE', 'Program', 'Rozh', 'created_at']

  navigationSubscription: Subscription

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private exportService: ExportService,
    private tocUtil: TocUtil,
    private router: Router,
    private titleService: Title
  ) {
    this.navigationSubscription = router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationEnd) {
          this._loadAdmission()
          window.scroll(0,0)
        }
      }
    )
  }

  ngOnInit() {
    this.tocUtil.createToc()
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe()
  }

  exportAll() {
    const tables = document.querySelectorAll('table:not([mat-table])')
    this.exportService.exportMultipleTablesToExcel(tables, 'summary', [{
      data: this.otherAdmissions.data
    }])
  }

  isAccepted(rozh) {
    if(rozh == 10 || rozh == 11 || rozh == 13) {
      return "Prijatý"
    } else {
      return "Neprijatý"
    }
  }

  _loadAdmission() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.dataService.getAdmission(this.id)
      .subscribe(data => {
        this.admission = data['admission']
        this.school = data['school']
        this.pointers = data['pointers'][0] || {}
        this.otherAdmissions = new MatTableDataSource(data['otherAdmissions'])

        this.otherAdmissions.paginator = this.paginator
        this.otherAdmissions.sort = this.sort

        this.titleService.setTitle(`Prijímacie konanie - ${this.admission['Meno']} ${this.admission['Priezvisko']}`)
      })
  }
}

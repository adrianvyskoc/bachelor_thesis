import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { MatTableDataSource } from '@angular/material/table';
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

  id
  admission = {}
  school = {}
  pointers = {}
  otherAdmissions

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
      data: this.otherAdmissions
    }])
  }

  _loadAdmission() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.dataService.getAdmission(this.id)
      .subscribe(data => {
        this.admission = data['admission']
        this.school = data['school']
        this.pointers = data['pointers'][0] || {}
        this.otherAdmissions = data['otherAdmissions']

        this.titleService.setTitle(`Prijímacie konanie - ${this.admission['Meno']} ${this.admission['Priezvisko']}`)
      })
  }
}

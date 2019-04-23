import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Exam } from 'src/app/model';
import { StateFinalExamsService } from '../../services/state-final-exams.service';
import { ExportService } from 'src/app/plugins/utils/export.service';

@Component({
  selector: 'app-state-final-exams-list-bc',
  templateUrl: './state-final-exams-list-bc.component.html',
  styleUrls: ['./state-final-exams-list-bc.component.scss']
})
export class StateFinalExamsListBcComponent implements OnInit, OnChanges {
 
  // hodnota z excelu vyhodnotenie v druhom harku
  paramsPldNavrhKomisie = 2;

  dataSource: MatTableDataSource<any>
  displayedColumns: string[] = [
    'id', 'uzavreteStudium', 'meno', 'studProgram', 'datumSS', 'komisia', 'predsenaKomisie', 
    'tajomnik', 'nazovBP', 'veduci', 'oponent', 'OH-veduci', 'OH-oponent', 'OH-komisia', 'P-vspBez', 
    'P-vspCele', 'DI-BP2vAJ', 'DI-SSOpravnyTermin', 'NCA-navrhVKomisii', 'NOKP-navrhVKomisiiPoradie', 
    'NOKP-skorTeoreticka', 'NOKP-skorPrakticka', 'NOKP-autoNavrh', 'NOKP-navrhDoRSP', 'NOKP-konecneRozhodnutie',
    'OP-autoNavrh', 'OP-navrhDoRSP', 'OP-konecneRozhodnutie', 'promocie', 'najhorsiaZnamkaPriCR']

  @Input() data: Array<Exam>

  constructor(
    private stateFinalExamsService: StateFinalExamsService,
    private exportService: ExportService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      this.dataSource = new MatTableDataSource<any>(changes.data.currentValue);

    }
  }

  change(val: Exam) {
    console.log(val);

    this.stateFinalExamsService.updateStateFinalExams(val).subscribe(data => console.log(data));
    // alert(val);
  }

  export() {
    const tables = document.querySelector('table')
    this.exportService.exportTableToExcel(tables, 'VyhodnotenieSZS')
  }

  // prvy vzorec
  navrhVKomisii(row: any): string {
    return this.hasValue(row.navrhVKomisiiPoradie) || this.navrhNaOcenenieAutNavrh(row) || this.ocenenieProspechAutNavrh(row) ? "Navrh" : ""
  }

  // druhy vzorec
  navrhNaOcenenieAutNavrh(row: any): string {
    // if (this.hasValue(row.vspStudBpo)) {
    //   if (+row.vspStudBpo <= 1.2) {
    //     if ( row.vysledneHodnotenie == 'A') {
    //       return 'CR'
    //     } else {
    //       if (this.hasValue(row.navrhVKomisiiPoradie)) {
    //         if (this.paramsPldNavrhKomisie === 1) {
    //           if (this.hasValue()) {

    //           } else {

    //           }
    //         } else {
    //           return ""
    //         }
    //       } else {
    //         return ""
    //       }
    //     }

    //   } else {

    //   }
    // } else {
      return ""
    // }
  }

  // treti vzorec
  ocenenieProspechAutNavrh(row: any): string {
    return ""
  }

  // just check
  hasValue(val: string) {
    return val && val.length > 0
  }
}

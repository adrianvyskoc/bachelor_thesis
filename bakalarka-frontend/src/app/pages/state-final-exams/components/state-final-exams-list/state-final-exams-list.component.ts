import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Exam } from 'src/app/model';

@Component({
  selector: 'app-state-final-exams-list',
  templateUrl: './state-final-exams-list.component.html',
  styleUrls: ['./state-final-exams-list.component.scss']
})
export class StateFinalExamsListComponent implements OnInit, OnChanges {
 

  dataSource: MatTableDataSource<any>
  displayedColumns: string[] = [
    'id', 'uzavreteStudium', 'meno', 'studProgram', 'datumSS', 'komisia', 'predsenaKomisie', 
    'tajomnik', 'nazovBP', 'veduci', 'oponent', 'OH-veduci', 'OH-oponent', 'OH-komisia', 'P-vspBez', 
    'P-vspCele', 'DI-BP2vAJ', 'DI-SSOpravnyTermin', 'NCA-navrhVKomisii', 'NOKP-navrhVKomisii', 
    'NOKP-skorTeoreticka', 'NOKP-skorPrakticka', 'NOKP-autoNavrh', 'NOKP-navrhDoRSP', 'NOKP-konecneRozhodnutie',
    'OP-autoNavrh', 'OP-navrhDoRSP', 'OP-konecneRozhodnutie', 'promocie', 'najhorsiaZnamkaPriCR']

  @Input() data: Array<Exam>
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      this.dataSource = new MatTableDataSource<any>(changes.data.currentValue);

    }
  }


}

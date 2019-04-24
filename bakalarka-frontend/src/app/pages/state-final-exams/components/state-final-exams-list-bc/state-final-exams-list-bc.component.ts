import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Exam } from 'src/app/model';
import { StateFinalExamsService } from '../../services/state-final-exams.service';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-state-final-exams-list-bc',
  templateUrl: './state-final-exams-list-bc.component.html',
  styleUrls: ['./state-final-exams-list-bc.component.scss']
})
export class StateFinalExamsListBcComponent implements OnInit, OnChanges {
  // hodnota z excelu Vyhodnotenie v druhom harku
  pldNavrhKomisie = 2

  znamky = ['A', 'B', 'C', 'D', 'E', 'FX']
  // // Parametre PLD
  // pldVeduci = 'B'
  // pldOponent ='B'
  // pldCelkovo = 'B'
  // // Parametre MCL
  // mclVsp = 1.19
  // mclVeduci = 'A'
  // mclOponent ='D'
  // mclCelkovo = 'A'
  // // Parametre CL
  // clVsp = 1.6
  // clVeduci = 'C'
  // clOponent ='D'
  // clCelkovo = 'B'
  // // Parametre CR ??
  // // ...

  dataSource: MatTableDataSource<any>
  displayedColumns: string[] = [
    'id', 'uzavreteStudium', 'meno', 'studProgram', 'datumSS', 'komisia', 'predsenaKomisie', 
    'tajomnik', 'nazovBP', 'veduci', 'oponent', 'OH-veduci', 'OH-oponent', 'OH-komisia', 'P-vspBez', 
    'P-vspCele', 'DI-BP2vAJ', 'DI-SSOpravnyTermin', 'NCA-navrhVKomisii', 'NOKP-navrhVKomisiiPoradie', 
    'NOKP-skorTeoreticka', 'NOKP-skorPrakticka', 'NOKP-autoNavrh', 'NOKP-navrhDoRSP', 'NOKP-konecneRozhodnutie',
    'OP-autoNavrh', 'OP-navrhDoRSP', 'OP-konecneRozhodnutie', 'promocie', 'najhorsiaZnamkaPriCR']

  @Input() data: Array<Exam>
  @Input() examConfig: any = {}

  configForm = new FormGroup({
    pldVeduci: new FormControl(''),
    pldOponent: new FormControl(''), 
    pldCelkovo: new FormControl(''),
    mclVsp: new FormControl(''), 
    mclVeduci: new FormControl(''), 
    mclOponent: new FormControl(''),
    mclCelkovo: new FormControl(''), 
    clVsp: new FormControl(''), 
    clVeduci: new FormControl(''),
    clOponent: new FormControl(''), 
    clCelkovo: new FormControl(''), 
  });

  constructor(
    private stateFinalExamsService: StateFinalExamsService,
    private exportService: ExportService,
  ) { }

  ngOnInit() {
    // console.log(this.examConfig);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      this.dataSource = new MatTableDataSource<any>(changes.data.currentValue);
    }
    else if ('examConfig' in changes) {
      this.examConfig = changes.examConfig.currentValue
      this.setFormValues();
    }
  }

  setFormValues() {
    this.configForm.controls['pldVeduci'].setValue(this.examConfig.pldVeduci);
    this.configForm.controls['pldOponent'].setValue(this.examConfig.pldOponent);
    this.configForm.controls['pldCelkovo'].setValue(this.examConfig.pldCelkovo);
    this.configForm.controls['mclVsp'].setValue(this.examConfig.mclVsp);
    this.configForm.controls['mclVeduci'].setValue(this.examConfig.mclVeduci);
    this.configForm.controls['mclOponent'].setValue(this.examConfig.mclOponent);
    this.configForm.controls['mclCelkovo'].setValue(this.examConfig.mclCelkovo);
    this.configForm.controls['clVsp'].setValue(this.examConfig.clVsp);
    this.configForm.controls['clVeduci'].setValue(this.examConfig.clVeduci);
    this.configForm.controls['clOponent'].setValue(this.examConfig.clOponent);
    this.configForm.controls['clCelkovo'].setValue(this.examConfig.clCelkovo);
  }

  onConfigFormSubmit() {
    console.log(this.configForm.value)

    this.stateFinalExamsService.updateFinalExamConfiguration(this.configForm.value).subscribe( data => console.log(data))
    // this.stateFinalExamsService.updateFinalExamConfiguration(this.configForm.value).subscribe( data => this.ngOnChanges(data))
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

  /*
    Vzorce
  */
  /*
    1. Vzorec
  */ 
  navrhVKomisii(row: any): string {
    return this.hasValue(row.navrhVKomisiiPoradie) || this.navrhNaOcenenieZaPracuAutoNavrh(row) || this.ocenenieZaProspechAutoNavrh(row) ? "Navrh" : ""
  }

  /*
    2. Vzorec = Návrh na ocenenie z komisie za prácu
  */
  navrhNaOcenenieZaPracuAutoNavrh(row: any): string {
    if (row.vysledneHodnotenie && row.vspStudium) { //toto bude len kontrolny ci sa nachadzaju data bez nich to nemoze byt, no podla toho ktore niektorre nemusia byt vyplnene

      if( row.vysledneHodnotenie == 'A' && +row.vspStudium <= 1.2 ) {
        return "CR"
      }
      else if(row.navrhVKomisiiPoradie) { //ak tu nieco je pozeram sa na parametre, ak nie je nepozeram sa na parametre

        if (row.veduciHodnotenie && row.oponentHodnotenie && row.vysledneHodnotenie) {
          let result: string;
          const pldCompare: any = {
            veduci: this.compareGrade(row.veduciHodnotenie, this.examConfig.pldVeduci),
            oponent: this.compareGrade(row.oponentHodnotenie, this.examConfig.pldOponent),
            celkovo: this.compareGrade(row.vysledneHodnotenie, this.examConfig.pldCelkovo)
          }

          for(let [key, value] of Object.entries(pldCompare)) {
            if (value) {
              result = 'PLD';
            } else {
              result = '';
              break;
            }
          }

          return result;
        }
        return null;
      }
    }
    return null
  }

  /*
    3. Vzorec = Ocenenie za prospech 
  */
  ocenenieZaProspechAutoNavrh(row: any): string {
    if (row.vspStudium && +row.vspStudium <= this.examConfig.mclVsp) {
      if (row.veduciHodnotenie && row.oponentHodnotenie && row.vysledneHodnotenie) {
        let result: string
        const mclCompare: any = {
          veduci: this.compareGrade(row.veduciHodnotenie, this.examConfig.mclVeduci),
          oponent: this.compareGrade(row.oponentHodnotenie, this.examConfig.mclOponent),
          celkovo: this.compareGrade(row.vysledneHodnotenie, this.examConfig.mclCelkovo)
        }

        for(let [key, value] of Object.entries(mclCompare)) {
          if(value) {
            result = 'MCL'
          } else {
            result = ''
            break
          }
        }

        return result
      }
      return 'chybaju znamky'
    }
    else if (row.vspStudium && +row.vspStudium <= this.examConfig.clVsp) {
      if (row.veduciHodnotenie && row.oponentHodnotenie && row.vysledneHodnotenie) {
        let result: string
        const clCompare: any = {
          veduci: this.compareGrade(row.veduciHodnotenie, this.examConfig.clVeduci),
          oponent: this.compareGrade(row.oponentHodnotenie, this.examConfig.clOponent),
          celkovo: this.compareGrade(row.vysledneHodnotenie, this.examConfig.clCelkovo)
        }

        for (let [key, value] of Object.entries(clCompare)) {
          if (value) {
            result = 'CL'
          } else {
            result = ''
            break
          }
        }

        return result
      }
      return 'chybaju znamky'
    }

    return null
  }


  // porovnanie či hodnota splna limit a je <= limit
  compareGrade(value: string, limit: string): boolean {
    return ((limit === value) ? true : ((limit > value) ? true : false));
  }

  hasValue(val: string) {
    return val && val.length > 0
  }

}
// if (this.hasValue(row.navrhVKomisiiPoradie))
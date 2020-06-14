import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exam, Param } from 'src/app/model';
import { StateFinalExamsService } from '../../services/state-final-exams.service';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-state-final-exams-list-bc',
  templateUrl: './state-final-exams-list-bc.component.html',
  styleUrls: ['./state-final-exams-list-bc.component.scss']
})
export class StateFinalExamsListBcComponent implements OnInit, OnChanges {

  dataSource: MatTableDataSource<any>
  displayedColumns: string[] = [
    'id', 'uzavreteStudium', 'meno', 'studProgram', 'datumSS', 'komisia', 'predsenaKomisie', 
    'tajomnik', 'nazovBP', 'veduci', 'oponent', 'OH-veduci', 'OH-oponent', 'OH-komisia', 'P-vspBez', 
    'P-vspCele', 'DI-BP2vAJ', 'DI-SSOpravnyTermin', 'NCA-navrhVKomisii', 'NOKP-navrhVKomisiiPoradie', 
    'NOKP-skorTeoreticka', 'NOKP-skorPrakticka', 'NOKP-autoNavrh', 'NOKP-navrhDoRSP', 'NOKP-konecneRozhodnutie',
    'OP-autoNavrh', 'OP-navrhDoRSP', 'OP-konecneRozhodnutie', 'promocie', 'najhorsiaZnamkaPriCR', 'poznamky', 'podozrenie' ]

  @Input() data: Array<Exam>
  @Input() examConfig: Param

  configForm = new FormGroup({
    crCelkovo: new FormControl('', this.isLegitString), 
    crVsp: new FormControl('', this.isLegitNumber), 
    pldVeduci: new FormControl('', this.isLegitString),
    pldOponent: new FormControl('', this.isLegitString), 
    pldCelkovo: new FormControl('', this.isLegitString),
    pldNavrh: new FormControl('', this.isLegitProposal),
    mclVsp: new FormControl('', this.isLegitNumber), 
    mclVeduci: new FormControl('', this.isLegitString), 
    mclOponent: new FormControl('', this.isLegitString),
    mclCelkovo: new FormControl('', this.isLegitString), 
    clVsp: new FormControl('', this.isLegitNumber), 
    clVeduci: new FormControl('', this.isLegitString),
    clOponent: new FormControl('', this.isLegitString), 
    clCelkovo: new FormControl('', this.isLegitString), 
  });

  constructor(
    private stateFinalExamsService: StateFinalExamsService,
    private exportService: ExportService,
  ) { }

  ngOnInit() {
    // console.log(this.examConfig);
  }
  /**
   * Kontrola validného vstupu pre parameter hodnotenie
   * @param c -hodnota na vstupe, ktorý sa kontroluje
   */
  isLegitString(c: FormControl) {
    const pattern = ['A', 'B', 'C', 'D', 'E', 'FX'];
    if (pattern.includes(c.value)) {
      return null;
    }
    return {
      isLegitString: {
        valid: false
      }
    }
  }

  /**
   * Kontrola validného vstupu pre parameter všp
   * Umožnenie vstupu pre číslo s . aj s ,
   * @param c -hodnota na vstupe, ktorý sa kontroluje
   */
  isLegitNumber(c: FormControl) {
    if(c.value != '') {
      let val = c.value
      if(val) {
        val = val.replace(',','.');
      }
      if (!isNaN(+val)) {
        return null;
      }
    }
    return {
      isLegitNumber: {
        valid: false
      }
    }
  }

  /**
   * Kontrola validného vstupu pre parameter návrh (poradie oceňovania)
   * @param c -hodnota na vstupe, ktorý sa kontroluje
   */
  isLegitProposal(c: FormControl) {
    const pattern = [1, 2];
    if (pattern.includes(+c.value)) {
      return null;
    }
    return {
      isLegitProposal: {
        valid: false
      }
    }
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
    this.configForm.controls['crVsp'].setValue(this.examConfig.crVsp);
    this.configForm.controls['crCelkovo'].setValue(this.examConfig.crCelkovo);
    this.configForm.controls['pldVeduci'].setValue(this.examConfig.pldVeduci);
    this.configForm.controls['pldOponent'].setValue(this.examConfig.pldOponent);
    this.configForm.controls['pldCelkovo'].setValue(this.examConfig.pldCelkovo);
    this.configForm.controls['pldNavrh'].setValue(this.examConfig.pldNavrh);
    this.configForm.controls['mclVsp'].setValue(this.examConfig.mclVsp);
    this.configForm.controls['mclVeduci'].setValue(this.examConfig.mclVeduci);
    this.configForm.controls['mclOponent'].setValue(this.examConfig.mclOponent);
    this.configForm.controls['mclCelkovo'].setValue(this.examConfig.mclCelkovo);
    this.configForm.controls['clVsp'].setValue(this.examConfig.clVsp);
    this.configForm.controls['clVeduci'].setValue(this.examConfig.clVeduci);
    this.configForm.controls['clOponent'].setValue(this.examConfig.clOponent);
    this.configForm.controls['clCelkovo'].setValue(this.examConfig.clCelkovo);
  }

  /**
   * Transformácia všp čísla s desatinnou čiarkou na desatinnú bodku
   * @param c -číslo zo vstupu 
   */
  transformNumbers(c : any) {
    if(c) {
      return c.replace(',','.');  
    }
  }

  onConfigFormSubmit() {
    const configObj = {
      id: 1,
      crVsp: this.transformNumbers(this.configForm.get('crVsp').value),
      crCelkovo: this.configForm.get('crCelkovo').value,
      pldVeduci: this.configForm.get('pldVeduci').value,
      pldOponent: this.configForm.get('pldOponent').value,
      pldCelkovo: this.configForm.get('pldCelkovo').value,
      pldNavrh: this.configForm.get('pldNavrh').value,
      mclVsp: this.transformNumbers(this.configForm.get('mclVsp').value),
      mclVeduci: this.configForm.get('mclVeduci').value,
      mclOponent: this.configForm.get('mclOponent').value,
      mclCelkovo: this.configForm.get('mclCelkovo').value,
      clVsp: this.transformNumbers(this.configForm.get('clVsp').value),
      clVeduci: this.configForm.get('clVeduci').value,
      clOponent: this.configForm.get('clOponent').value,
      clCelkovo: this.configForm.get('clCelkovo').value,
    }

    this.stateFinalExamsService.updateFinalExamConfiguration(configObj)
      .subscribe(
        data => {
          console.log(data)
        },
        error => {
          console.log(error)
        })
  }

  change(val: Exam) {
    console.log(val);
    this.stateFinalExamsService.updateStateFinalExams(val).subscribe(data => console.log(data));
  }

  export() {
    const tables = document.querySelector('table')
    this.exportService.exportTableToExcel(tables, 'VyhodnotenieSZS-BC')
  }

  /*
    Vzorce
  */
 /**
  * 1 Vzorec = Návrh - akákoľvek cena
  * @param row - údaje o študentovi, ktoré overujeme
  */
  navrhVKomisii(row: any): string {
    return this.hasValue(row.navrhVKomisiiPoradie) || this.navrhNaOcenenieZaPracuAutoNavrh(row) || this.ocenenieZaProspechAutoNavrh(row) ? "Navrh" : ""
  }

  
 /**
  * 2 Vzorec = Návrh na ocenenie z komisie za prácu
  * @param row - údaje o študentovi, ktoré overujeme
  */
  navrhNaOcenenieZaPracuAutoNavrh(row: any): string {
    if (row.vysledneHodnotenie && row.vspStudium) {

      if (row.vysledneHodnotenie <= this.examConfig.crCelkovo && +row.vspStudium <= this.examConfig.crVsp) {
        return "CR"
      }
      else if (row.navrhVKomisiiPoradie) { 

        // ak je parameter PLD Návrh nastavený na 1 a zároveň aj návrh komisie je 1
        if (+this.examConfig.pldNavrh === 1 && row.navrhVKomisiiPoradie == this.examConfig.pldNavrh) {
          if (row.veduciHodnotenie && row.oponentHodnotenie && row.vysledneHodnotenie) {
            let result: string;
            const pldCompare: any = {
              veduci: this.compareGrade(row.veduciHodnotenie, this.examConfig.pldVeduci),
              oponent: this.compareGrade(row.oponentHodnotenie, this.examConfig.pldOponent),
              celkovo: this.compareGrade(row.vysledneHodnotenie, this.examConfig.pldCelkovo)
            }
            // kontrola, či všetky parametre spĺňajú podmienky na udelenie ocenenia 
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
        } 
        // ak je parameter PLD Návrh nastavený na 2, návrh komisie môže byť hocijaká hodnota
        else if (+this.examConfig.pldNavrh === 2) {
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
        }
        return null;
      }
    }
    return null
  }

 /**
  * 3 Vzorec = Ocenenie za prospech
  * @param row - údaje o študentovi, ktoré overujeme
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
      return null
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
      return null
    }
    return null
  }

  /**
   * Porovnanie, či hodnotenie spadá do limitu zadefinovaného parametrom na ocenenie
   * value <= limit
   * @param value - hodnotenie záverečnej práce
   * @param limit - hodnota parametra pre ocenenie
   */
  compareGrade(value: string, limit: string): boolean {
    return ((limit === value) ? true : ((limit > value) ? true : false));
  }

  hasValue(val: string) {
    return val && val.length > 0
  }

}

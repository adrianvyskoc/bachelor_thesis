import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ExamIng, Param } from 'src/app/model';
import { StateFinalExamsService } from '../../services/state-final-exams.service';
import { ExportService } from 'src/app/plugins/utils/export.service';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-state-final-exams-list-ing',
  templateUrl: './state-final-exams-list-ing.component.html',
  styleUrls: ['./state-final-exams-list-ing.component.scss']
})
export class StateFinalExamsListIngComponent implements OnInit, OnChanges {

  dataSource: MatTableDataSource <any>
    // meno rozdelit do 3;
    displayedColumns: string[] = [
      'id', 'uzavreteStudium', 'meno', 'studProgram', 'datumSS', 'komisia', 'predsenaKomisie',
      'tajomnik', 'nazovDP', 'veduci', 'oponent', 'OH-oponent', 'OH-komisia', 'P-vspBez',
      'P-vspCele', 'DI-hlasiSaNaPhd', 'DI-DP3vAJ', 'DI-SSOpravnyTermin', 'NCA-autoNavrh', 
      'NOKP-navrhPoradie', 'NOKP-clanokIny', 'NOKP-clanokIITSRC', 'NOKP-autoNavrh', 
      'NOKP-navrhDoRSP1', 'NOKP-konecneRozhodnutie1', 'OP-autoNavrh', 'OP-navrhDoRSP2', 
      'OP-konecneRozhodnutie2', 'S-konecneRozhodnutie', 'potvrdenieIET', 'poznamky', 'podozrenie'
    ]

  @Input() dataIng: Array <ExamIng>
    @Input() examConfigIng: Param

  configFormIng = new FormGroup({
    crCelkovo: new FormControl('', this.isLegitString),
    crVsp: new FormControl('', this.isLegitNumber),
    pldOponent: new FormControl('', this.isLegitString),
    pldCelkovo: new FormControl('', this.isLegitString),
    pldNavrh: new FormControl('', this.isLegitProposal),
    mclVsp: new FormControl('', this.isLegitNumber),
    mclOponent: new FormControl('', this.isLegitString),
    mclCelkovo: new FormControl('', this.isLegitString),
    clVsp: new FormControl('', this.isLegitNumber),
    clOponent: new FormControl('', this.isLegitString),
    clCelkovo: new FormControl('', this.isLegitString),
  });

  constructor(
    private stateFinalExamsService: StateFinalExamsService,
    private exportService: ExportService,
  ) {}

  ngOnInit() {}

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
    if (c.value != '') {
      let val = c.value
      if (val) {
        val = val.replace(',', '.');
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
    if ('dataIng' in changes) {
      this.dataSource = new MatTableDataSource <any> (changes.dataIng.currentValue);
    } 
    else if ('examConfigIng' in changes) {
      this.examConfigIng = changes.examConfigIng.currentValue
      this.setFormValues();
    }
  }

  setFormValues() {
    this.configFormIng.controls['crVsp'].setValue(this.examConfigIng.crVsp);
    this.configFormIng.controls['crCelkovo'].setValue(this.examConfigIng.crCelkovo);
    this.configFormIng.controls['pldOponent'].setValue(this.examConfigIng.pldOponent);
    this.configFormIng.controls['pldCelkovo'].setValue(this.examConfigIng.pldCelkovo);
    this.configFormIng.controls['pldNavrh'].setValue(this.examConfigIng.pldNavrh);
    this.configFormIng.controls['mclVsp'].setValue(this.examConfigIng.mclVsp);
    this.configFormIng.controls['mclOponent'].setValue(this.examConfigIng.mclOponent);
    this.configFormIng.controls['mclCelkovo'].setValue(this.examConfigIng.mclCelkovo);
    this.configFormIng.controls['clVsp'].setValue(this.examConfigIng.clVsp);
    this.configFormIng.controls['clOponent'].setValue(this.examConfigIng.clOponent);
    this.configFormIng.controls['clCelkovo'].setValue(this.examConfigIng.clCelkovo);
  }

  /**
   * Transformácia všp čísla s desatinnou čiarkou na desatinnú bodku
   * @param c -číslo zo vstupu 
   */
  transformNumbers(c: any) {
    if (c) {
      return c.replace(',', '.');
    }
  }

  onConfigFormSubmitIng() {
    const configObj = {
      id: 1,
      crVsp: this.transformNumbers(this.configFormIng.get('crVsp').value),
      crCelkovo: this.configFormIng.get('crCelkovo').value,
      pldOponent: this.configFormIng.get('pldOponent').value,
      pldCelkovo: this.configFormIng.get('pldCelkovo').value,
      pldNavrh: this.configFormIng.get('pldNavrh').value,
      mclVsp: this.transformNumbers(this.configFormIng.get('mclVsp').value),
      mclOponent: this.configFormIng.get('mclOponent').value,
      mclCelkovo: this.configFormIng.get('mclCelkovo').value,
      clVsp: this.transformNumbers(this.configFormIng.get('clVsp').value),
      clOponent: this.configFormIng.get('clOponent').value,
      clCelkovo: this.configFormIng.get('clCelkovo').value,
    }

    this.stateFinalExamsService.updateFinalExamConfigurationIng(configObj)
      .subscribe(
        dataIng => {
          console.log(dataIng)
        },
        error => {
          console.log(error)
        })
  }

  change(val: ExamIng) {
    console.log(val);
    this.stateFinalExamsService.updateStateFinalExamsIng(val).subscribe(dataIng => console.log(dataIng));
  }

  export () {
    const tables = document.querySelector('table')
    this.exportService.exportTableToExcel(tables, 'VyhodnotenieSZS-ING')
  }

  /*
    Vzorce
  */
  /**
   * 1 Vzorec = Návrh - akákoľvek cena
   * @param row - údaje o študentovi, ktoré overujeme
   */
  navrhVKomisii(row: any): string {
    return this.hasValue(row.navrhPoradie) || this.navrhNaOcenenieZaPracuAutoNavrh(row) || this.ocenenieZaProspechAutoNavrh(row) ? "Navrh" : ""
  }

  /**
   * 2 Vzorec = Návrh na ocenenie z komisie za prácu
   * @param row - údaje o študentovi, ktoré overujeme
   */
  navrhNaOcenenieZaPracuAutoNavrh(row: any): string {
    if (row.vysledneHodnotenie && row.vspStudium) {

      if (row.vysledneHodnotenie <= this.examConfigIng.crCelkovo && +row.vspStudium <= this.examConfigIng.crVsp) {
        return "CR"
      } else if (row.navrhPoradie) {

        // ak je parameter PLD Návrh nastavený na 1 a zároveň aj návrh komisie je 1
        if (+this.examConfigIng.pldNavrh === 1 && row.navrhPoradie == this.examConfigIng.pldNavrh) {
          if (row.oponentHodnotenie && row.vysledneHodnotenie) {
            let result: string;
            const pldCompare: any = {
              oponent: this.compareGrade(row.oponentHodnotenie, this.examConfigIng.pldOponent),
              celkovo: this.compareGrade(row.vysledneHodnotenie, this.examConfigIng.pldCelkovo)
            }
            // kontrola, či všetky parametre spĺňajú podmienky na udelenie ocenenia 
            for (let [key, value] of Object.entries(pldCompare)) {
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
        else if (+this.examConfigIng.pldNavrh === 2) {
          if (row.oponentHodnotenie && row.vysledneHodnotenie) {
            let result: string;
            const pldCompare: any = {
              oponent: this.compareGrade(row.oponentHodnotenie, this.examConfigIng.pldOponent),
              celkovo: this.compareGrade(row.vysledneHodnotenie, this.examConfigIng.pldCelkovo)
            }

            for (let [key, value] of Object.entries(pldCompare)) {
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
    if (row.vspStudium && +row.vspStudium <= this.examConfigIng.mclVsp) {
      if (row.oponentHodnotenie && row.vysledneHodnotenie) {
        let result: string
        const mclCompare: any = {
          oponent: this.compareGrade(row.oponentHodnotenie, this.examConfigIng.mclOponent),
          celkovo: this.compareGrade(row.vysledneHodnotenie, this.examConfigIng.mclCelkovo)
        }

        for (let [key, value] of Object.entries(mclCompare)) {
          if (value) {
            result = 'MCL'
          } else {
            result = ''
            break
          }
        }
        return result
      }
      return null
    } else if (row.vspStudium && +row.vspStudium <= this.examConfigIng.clVsp) {
      if (row.oponentHodnotenie && row.vysledneHodnotenie) {
        let result: string
        const clCompare: any = {
          oponent: this.compareGrade(row.oponentHodnotenie, this.examConfigIng.clOponent),
          celkovo: this.compareGrade(row.vysledneHodnotenie, this.examConfigIng.clCelkovo)
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

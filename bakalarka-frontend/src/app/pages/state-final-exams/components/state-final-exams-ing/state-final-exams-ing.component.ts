import { Component, OnInit } from '@angular/core';
import { StateFinalExamsService } from '../../services/state-final-exams.service';
import { ExamIng, Param } from 'src/app/model';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-state-final-exams-ing',
  templateUrl: './state-final-exams-ing.component.html',
  styleUrls: ['./state-final-exams-ing.component.scss']
})
export class StateFinalExamsIngComponent implements OnInit {
  dataIng: Array < ExamIng > ;
  examConfigIng: Param;
  yearOptions: string[];
  filterForm = new FormGroup({
    yearOption: new FormControl(''),
  });

  constructor(
    private stateFinalExamsService: StateFinalExamsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getYearDatesIng();
    this.getFinalStateConfigIng();
  }

  /**
   * Kontrolovanie, či sa v hodnotení nenachádza preklep
   * @param valuation - hodnotenie na kontrolu
   */
  faultInValuationIng(valuation: string): string {
    const grades = ['A', 'B', 'C', 'D', 'E', 'FX']
    let allRight: string = 'Preklep v hodnotení záverečnej práce';

    if (valuation === null || valuation === 'undefined') {
      allRight = 'Chýba hodnotenie';
    } else if (valuation && valuation != null) {
      grades.forEach(g => {
        if (valuation == g) {
          allRight = '';
        }
      })
      return allRight
    }
    return allRight
  }

  /**
   * Získanie hodnôt parametrov na oceňovanie študentov inžinierskeho ročníka
   */
  getFinalStateConfigIng(): void {
    this.stateFinalExamsService.getFinalExamConfigurationIng()
      .subscribe(
        dataIng => {
          this.examConfigIng = dataIng;
          console.log(this.examConfigIng)
        },
        error => {
          console.log(error);
        }
      );
  }

  /**
   * Získanie všetkých rokov, ktoré sa importovali s dátami
   * a načítanie údajov z najaktuálnejšieho importu
   */
  getYearDatesIng(): void {
    this.stateFinalExamsService.getYearDatesIng()
      .subscribe(
        dataIng => {
          this.yearOptions = dataIng;
          const selectedOption = this.yearOptions[this.yearOptions.length - 1];
          this.filterForm.get('yearOption')
            .setValue(
              selectedOption
            );
          this.getStateFinalExamsIng(selectedOption);
        },
        error => {
          console.log(error);
        }
      )
  }

  onFilterFormSubmitIng(): void {
    this.getStateFinalExamsIng(
      this.filterForm.get('yearOption').value
    );
  }

  onFilterFormDeleteIng(): void {
    this.deleteStateFinalExamsIng(
      this.filterForm.get('yearOption').value
    );
  }

  /**
   * Vymazanie súborov pre ŠZS daného roku (z dôvodu, že importované zdrojové súbory obsahovali chybu, ktorá sa opravila a je potrebné tieto chybné dáta vymazať)
   * @param selectedYear - rok podľa ktorého sa majú vymazať súbory
   */
  deleteStateFinalExamsIng(selectedYear: string): void {
    this.stateFinalExamsService.deleteStateFinalExamsIng(selectedYear)
      .subscribe(dataIng => console.log(dataIng))
    // this.router.navigate(['import'])
  }

  /**
   * Získanie všetkých údajov na Vyhodnotenie ŠZS ING a detekcia chýb dát
   */
  getStateFinalExamsIng(selectedYear: string): void {
    this.stateFinalExamsService.getAllStateFinalExamsIng(selectedYear)
      .subscribe(
        dataIng => {
          dataIng.map(e => {
            e.podozrenie = '';

            /**
             * Detekcia chýb
             */
            if (this.faultInValuationIng(e.oponentHodnotenie) != '') {
              e.podozrenie += (this.faultInValuationIng(e.oponentHodnotenie) + ' od oponenta. ')
            }
            if (this.faultInValuationIng(e.vysledneHodnotenie) != '') {
              e.podozrenie += (this.faultInValuationIng(e.vysledneHodnotenie) + ' od komisie. ')
            }

            if (e.celeMenoSTitulmi && e.celeMenoSTitulmi !== null && !e.student) {
              e.podozrenie += e.celeMenoSTitulmi + ': Neštátnicoval/a tento rok (možný tiež preklep v mene/práci) '
            }
            if (!e.celeMenoSTitulmi && e.student !== null) {
              e.podozrenie += 'Študent ' + e.student + ' sa nenachádza v súbore z AIS-u. '
            }
            if (!e.celeMenoSTitulmi && !e.student) {
              e.podozrenie += 'V importovanom súbore sa nachádzal neprázdny riadok, ktorý neobsahoval dáta študenta. '
            }
          })

          this.dataIng = dataIng
          console.log(dataIng);
        },
        error => {
          console.log(error)
        })
  }
}

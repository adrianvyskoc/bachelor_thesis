import { Component, OnInit } from '@angular/core';
import { StateFinalExamsService } from '../../services/state-final-exams.service';
import { Exam, Param } from 'src/app/model';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-state-final-exams-bc',
  templateUrl: './state-final-exams-bc.component.html',
  styleUrls: ['./state-final-exams-bc.component.scss']
})
export class StateFinalExamsBcComponent implements OnInit {
  data: Array<Exam>;
  examConfig: Param;
  yearOptions: string[];
  filterForm = new FormGroup({
    yearOption: new FormControl(''),
  });

  constructor(
    private stateFinalExamsService: StateFinalExamsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getYearDates();
    this.getFinalStateConfig();
  }

  /**
   * Kontrolovanie, či sa v hodnotení nenachádza preklep
   * @param valuation - hodnotenie na kontrolu
   */
  faultInValuation(valuation: string): string {
    const grades = ['A', 'B', 'C', 'D', 'E', 'FX']
    let allRight: string = 'Preklep v hodnotení záverečnej práce';

    if (valuation === null || valuation === 'undefined') {
      allRight = 'Chýba hodnotenie';
    }
    else if (valuation && valuation != null) {
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
   * Získanie hodnôt parametrov na oceňovanie študentov bakalárskeho ročníka
   */
  getFinalStateConfig(): void {
    this.stateFinalExamsService.getFinalExamConfiguration()
      .subscribe(
        data => {
          this.examConfig = data;
          console.log(this.examConfig)
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
  getYearDates(): void {
    this.stateFinalExamsService.getYearDates()
      .subscribe(
        data => {
          this.yearOptions = data;
          const selectedOption = this.yearOptions[this.yearOptions.length - 1];
          this.filterForm.get('yearOption')
            .setValue(
              selectedOption
            );
            this.getStateFinalExams(selectedOption);
        },
        error => {
          console.log(error);
        }
      )
  }

  onFilterFormSubmit(): void {
    this.getStateFinalExams(
      this.filterForm.get('yearOption').value
    );
  }

  onFilterFormDelete(): void {
    this.deleteStateFinalExams(
      this.filterForm.get('yearOption').value
    );
  }

  /**
   * Vymazanie súborov pre ŠZS daného roku (z dôvodu, že importované zdrojové súbory obsahovali chybu, ktorá sa opravila a je potrebné tieto chybné dáta vymazať)
   * @param selectedYear - rok podľa ktorého sa majú vymazať súbory
   */
  deleteStateFinalExams(selectedYear: string): void{
    this.stateFinalExamsService.deleteStateFinalExams(selectedYear)
      .subscribe(data => console.log(data))
      // this.router.navigate(['import'])
  }

  /**
   * Získanie všetkých údajov na Vyhodnotenie ŠZS BC a upravenie dát pre komisiu (z komisie sa vyberie číslo a spojí sa so štud. prog.)
   */
  getStateFinalExams(selectedYear: string): void {
    this.stateFinalExamsService.getAllStateFinalExams(selectedYear)
      .subscribe(
        data => {
          data.map(e => {
            let comission = ''
            if (e.komisia) {
              let tmp = e.komisia.trim().split('.')
              comission = tmp.pop()
            } else {
              if (!e.studProg) {
                e.studProg = '-'
              }
            }

            e.komisia = `${comission} ${e.studProg}`
            e.podozrenie = '';

            /**
             * Detekcia chýb
             */

            if (this.faultInValuation(e.veduciHodnotenie) != '') {
              e.podozrenie += (this.faultInValuation(e.veduciHodnotenie) + ' od vedúceho. ')
            }
            if (this.faultInValuation(e.oponentHodnotenie) != '') {
              e.podozrenie += (this.faultInValuation(e.oponentHodnotenie) + ' od oponenta. ')
            }
            if (this.faultInValuation(e.vysledneHodnotenie) != '') {
              e.podozrenie += (this.faultInValuation(e.vysledneHodnotenie) + ' od komisie. ')
            }

            if (e.celeMenoSTitulmi && !e.vysledneHodnotenie && e.celeMenoSTitulmi !== null) {
              e.podozrenie += e.celeMenoSTitulmi + ': Neštátnicoval/a tento rok (možný tiež preklep v mene/práci) '
            }
            if (!e.celeMenoSTitulmi && e.riesitel !== null) {
              e.podozrenie += 'Študent ' + e.riesitel + ' sa nenachádza v súbore z AIS-u. '
            }
            if (!e.celeMenoSTitulmi && !e.riesitel) {
              e.podozrenie += 'V importovanom súbore sa nachádzal neprázdny riadok, ktorý neobsahoval dáta študenta. '
            }
            /**
             * Pokial by sa poznámka 2x nachádzala inde ako v dátach podľa kt. spájame, dalo by sa to využiť
             */
            // if (e.riesitel) {
            //   const secondStateFinalExam = '2x'
            //   if (e.riesitel.includes(secondStateFinalExam)) {
            //     e.podozrenie += 'Štátnicuje druhý krát!'
            //   }
            // }
          })

          this.data = data
          console.log(data);
        },
        error => {
          console.log(error)
        })
  }
}

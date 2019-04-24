import { Component, OnInit } from '@angular/core';
import { StateFinalExamsService } from '../../services/state-final-exams.service';
import { Exam } from 'src/app/model';

@Component({
  selector: 'app-state-final-exams-bc',
  templateUrl: './state-final-exams-bc.component.html',
  styleUrls: ['./state-final-exams-bc.component.scss']
})
export class StateFinalExamsBcComponent implements OnInit {
  data: Array<Exam>;
  examConfig: any;

  constructor(
    private stateFinalExamsService: StateFinalExamsService,
  ) { }

  ngOnInit() {
    this.examConfig = {};
    // this.stateFinalExamsService.getAllStateFinalExams().subscribe( data => this.data = data )

    this.stateFinalExamsService.getFinalExamConfiguration()
      .subscribe(
        data => {
          this.examConfig = data;
          console.log(this.examConfig);
        },
        error => {
          console.log(error);
        }
      )
    
    // získanie všetkých údajov na Vyhodnotenie ŠZS BC a upravenie dát pre komisiu (z komisie vybrate čísla a spojenie so štud. prog.)
    this.stateFinalExamsService.getAllStateFinalExams()
      .subscribe(
        data => {
          data.map(e => {
            let comission = ''
            if (e.komisia) {
              let tmp = e.komisia.trim().split('.')
              comission = tmp.pop()
            } else {
               if(!e.studProg) {
                 e.studProg = '-'
               }
            }

            e.komisia = `${comission} ${e.studProg}`
          })

          this.data = data
        },
        error => {
          console.log(error)
        })

  }

}

import { Component, OnInit } from '@angular/core';
import { StateFinalExamsService } from '../../services/state-final-exams.service';
import { Exam } from 'src/app/model';

@Component({
  selector: 'app-state-final-exams',
  templateUrl: './state-final-exams.component.html',
  styleUrls: ['./state-final-exams.component.scss']
})
export class StateFinalExamsComponent implements OnInit {

  data: Array<Exam>;

  constructor(
    private stateFinalExamsService: StateFinalExamsService,
  ) { }

  ngOnInit() {
    // this.stateFinalExamsService.getAllStateFinalExams().subscribe( data => this.data = data )
    
    // získanie všetkých údajov na Vyhodnotenie ŠZS BC a upravenie dát pre komisiu (z komisie vybrate čísla a spojenie so štud. prog.)
    this.stateFinalExamsService.getAllStateFinalExams()
      .subscribe(
        data => {
          console.log(data)
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

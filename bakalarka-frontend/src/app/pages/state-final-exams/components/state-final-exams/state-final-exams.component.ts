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
    this.stateFinalExamsService.getAllStateFinalExams().subscribe( data => this.data = data )
  }

}

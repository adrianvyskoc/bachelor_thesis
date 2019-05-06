import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Student } from 'src/app/model';
import { ExportService } from 'src/app/plugins/utils/export.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  filterForm = new FormGroup({
    yearOption: new FormControl(''),
    duration: new FormControl('9')
  });
  filterFormDelete = new FormGroup({
    yearOptionDelete: new FormControl(''),
  })

  yearOptions: string[];
  yearOptionsForDelete: string[];
  durationOptions: number[] = [2, 3, 4, 5, 6, 7, 8, 9];
  data: Array<Student>
  selectedYear: string;
  bakArr: any[];
  ingArr: any[];
  bakPassArr: any[]
  ingPassArr: any[]

  constructor(
    private statisticsService: StatisticsService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.getYearDates();
  }
  /**
   * Získanie všetkých rokov nástupu
   */
  getYearDates(): void {
    this.statisticsService.getYearDatesStart()
      .subscribe(
        data => {
          this.yearOptions = data;
          const selectedOption = this.yearOptions[this.yearOptions.length-1]
          this.filterForm.get('yearOption').setValue(selectedOption)
          // this.getStatistics(selectedOption)
        }
      )

    this.statisticsService.getYearDatesDelete()
        .subscribe(
          data => {
            this.yearOptionsForDelete = data;
            const selectedOptionForDelete = this.yearOptionsForDelete[this.yearOptionsForDelete.length-1]
            this.filterFormDelete.get('yearOptionDelete').setValue(selectedOptionForDelete)
          }
        )
  }
 
  onFilterFormSubmit(): void {
    this.getStatistics(
      this.filterForm.get('yearOption').value,
      this.filterForm.get('duration').value
    )
  }
  onFilterFormDelete(): void {
    this.deleteStatisticsYear(
      this.filterFormDelete.get('yearOptionDelete').value
    );
  }

  deleteStatisticsYear(selectedYear: string): void {
    this.statisticsService.deleteStatisticsYear(selectedYear)
      .subscribe(data => console.log(data))
  }

  /**
   * Získanie dát o študentoch
   * @param selectedYear - vybraný rok z form alebo najaktuálnejší rok nástupu
   */
  getStatistics(selectedYear: string, duration: string): void {
    this.bakArr = [];
    this.ingArr = [];
    this.bakPassArr = [];
    this.ingPassArr = [];
    this.statisticsService.getStatistics(selectedYear, duration)
      .subscribe(
        data => {
          this.bakArr['completed'] = [];
          this.ingArr['completed'] = [];
          this.bakArr['totalCompleted'] = [];
          this.ingArr['totalCompleted'] = [];
          let totalCompletedBak = 0;
          let totalCompletedIng = 0;

          // this.bakArr['completed'][selectedYear] = 0;
          // this.ingArr['completed'][selectedYear] = 0;
          

          for(let key in data) {
            this.ingArr[key] = {winter: [], summer: [], completed: 0};
            this.bakArr[key] = {winter: [], summer: [], completed: 0};
            for(let i = 0; i < data[key].winter.length; i++) {
              if (data[key].winter[i]['identifikStud'].includes('I-')) {
                this.ingArr[key].winter.push(data[key].winter[i]);
              } else if (data[key].winter[i]['identifikStud'].includes('B-')) {
                this.bakArr[key].winter.push(data[key].winter[i]);
              }
            }

            let completedIng = 0;
            let completedBak = 0;

            for(let i = 0; i < data[key].summer.length; i++) {
              if (data[key].summer[i]['identifikStud'].includes('I-')) {
                this.ingArr[key].summer.push(data[key].summer[i]);
                if (data[key].summer[i]['datumSplnenia']) {
                  totalCompletedBak++;
                  
                  let completeYearCandidate = parseInt(key) + 1;
                  if (data[key].summer[i]['datumSplnenia'].includes(completeYearCandidate)) {
                    completedIng++;
                  }
                }
              } else if (data[key].summer[i]['identifikStud'].includes('B-')) {
                this.bakArr[key].summer.push(data[key].summer[i]);
                if (data[key].summer[i]['datumSplnenia']) {
                  totalCompletedIng++;
                  let completeYearCandidate = parseInt(key) + 1;
                  if (data[key].summer[i]['datumSplnenia'].includes(completeYearCandidate)) {
                    completedBak++;
                  }
                }
              }
            }

            // let tmpKey = parseInt(key) + 1;

            // if (tmpKey === (parseInt(selectedYear) + parseInt(duration))) {
            //   continue;
            // }
            
            // this.bakArr['completed'][tmpKey] = completedBak;
            // this.ingArr['completed'][tmpKey] = completedIng;
            this.bakArr['completed'][key] = completedBak;
            this.ingArr['completed'][key] = completedIng;
          }
          this.bakArr['totalCompleted'] = totalCompletedBak;
          this.ingArr['totalCompleted'] = totalCompletedIng;
          
          this.bakArr['count'] = [];
          for(let key in this.bakArr) {
            if (['count', 'completed', 'totalCompleted'].includes(key)) continue;
            this.bakArr['count'][key] = { 1: [], 2: []};
            this.bakArr['count'][key]['1'] = this.bakArr[key].winter.length;
            this.bakArr['count'][key]['2'] = this.bakArr[key].summer.length;
          }
          
          this.ingArr['count'] = [];
          for(let key in this.ingArr) {
            if (['count', 'completed', 'totalCompleted'].includes(key)) continue;
            this.ingArr['count'][key] = { 1: [], 2: []};
            this.ingArr['count'][key]['1'] = this.ingArr[key].winter.length;
            this.ingArr['count'][key]['2'] = this.ingArr[key].summer.length;
          }

          console.log(this.bakArr);
        },
        error => {
          console.log(error);
        }
      );
  }

  exportAll() {
    const tables = document.querySelectorAll('table:not([mat-table])')
    this.exportService.exportMultipleTablesToExcel(tables, 'Štatistika', [{
      data: this.bakArr
    }])
  }
}

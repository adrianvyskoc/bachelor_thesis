import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedYear: string

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.selectedYear = this.dataService.getYear()
  }

  onYearSelect() {
    this.dataService.setYear(this.selectedYear)
  }

}

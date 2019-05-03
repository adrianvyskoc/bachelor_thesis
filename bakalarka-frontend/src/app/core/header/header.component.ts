import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  selectedYear: string = 'all'

  yearsSelection = []

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.generateYears()
    this.dataService.getYear()
      .subscribe(year => this.selectedYear = year)
  }

  onYearSelect() {
    this.dataService.setYear(this.selectedYear)
  }

  onFacultySelect() {
    // TODO
  }

  logoutUser() {
    this.authService.logoutUser()
    this.router.navigate(['login'])
  }

  generateYears() {
    const currentYear = new Date().getFullYear()
    for(let i = 2000; i < currentYear + 1; i++) {
      this.yearsSelection.push(`${i}-${i+1}`)
    }
  }
}

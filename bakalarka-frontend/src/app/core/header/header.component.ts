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

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
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

  }
}

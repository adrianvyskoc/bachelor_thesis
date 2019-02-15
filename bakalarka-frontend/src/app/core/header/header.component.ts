import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { AuthService } from 'src/app/login/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedYear: string

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

  logoutUser() {
    this.authService.logoutUser()
    this.router.navigate(['login'])
  }
}

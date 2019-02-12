import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { AuthService } from 'src/app/login/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedYear: string

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.selectedYear = this.dataService.getYear()
  }

  onYearSelect() {
    this.dataService.setYear(this.selectedYear)
  }

  
  logoutUser() {
    this.authService.logoutUser()
  }

}

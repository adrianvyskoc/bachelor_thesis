import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/login/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  private loggedIn: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loggedIn = this.authService.loggedIn;
  }

}

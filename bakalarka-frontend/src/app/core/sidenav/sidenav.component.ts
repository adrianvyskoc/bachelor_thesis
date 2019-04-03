import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/services/auth.service';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  toc
  private loggedIn: boolean;

  constructor(
    private authService: AuthService,
    private tocUtil: TocUtil,
  ) { }

  ngOnInit() {
    this.tocUtil.getTocUpdateListener()
      .subscribe(
        toc => this.toc = toc
      )

    this.loggedIn = this.authService.loggedIn;
  }
}

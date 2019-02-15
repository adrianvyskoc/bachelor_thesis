import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/pages/settings/settings.service';

@Component({
  selector: 'app-codebook-table',
  templateUrl: './codebook-table.component.html',
  styleUrls: ['./codebook-table.component.css']
})
export class CodebookTableComponent implements OnInit, OnDestroy {
  @Input() codebookType
  @Input() title
  subscription: Subscription

  codebookData = []
  newRecord = false

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsService.getCodebookData(this.codebookType)

    this.subscription = this.settingsService.getUpdateListener(this.codebookType)
      .subscribe(
        (data:any[]) => {
          this.codebookData = data
        }
      )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  onAddRecord(form: NgForm) {
    this.settingsService.createAttendanceType(this.codebookType, form.value)
    this.newRecord = false
  }
}

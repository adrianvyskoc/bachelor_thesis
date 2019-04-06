import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  importedYears

  selectedFile: File = null
  selectedSource: string = ""
  selectedImport: string = ""
  fileName: string

  schoolYear = ""
  semester = ""

  disableImport: boolean = true

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.getImportedYears()
    this.dataService.getImportedYearsUpdateListener()
      .subscribe(years => this.importedYears = years)
  }

  addFile() {
    this.fileInput.nativeElement.click()
  }

  onUpload() {
    this.dataService.uploadData(this.selectedFile, this.selectedImport, this.selectedSource, this.schoolYear)
    this.dataService.loading = true
    this.resetForm()
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0]
    this.fileName = event.target.files[0] ? event.target.files[0].name : ""
    this.onFormChange()
  }

  resetForm() {
    this.selectedFile = null
    this.fileName = ""
    this.selectedSource = ""
    this.selectedImport = ""
    this.semester = ""
    this.schoolYear = ""
  }

  onFormChange() {
    if(this.selectedSource == 'ais') {
      if(this.selectedImport == 'Attendance' || this.selectedImport == 'Grades')
        this.disableImport = (!this.semester || !this.schoolYear)
      else
        this.disableImport = !this.schoolYear
    } else if(this.selectedSource == 'ineko') {
      if(this.selectedImport == 'Schools')
        this.disableImport = false
      else
        this.disableImport = !this.schoolYear
    } else
      this.disableImport = true

    if(!this.fileName)
      this.disableImport = true
  }
}

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

  schoolYear
  semester

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
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0]
    this.fileName = event.target.files[0].name
  }

}

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Title } from '@angular/platform-browser';

import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material';
import { MappingDialogComponent } from './mapping-dialog/mapping-dialog.component';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  importedYears

  selectedFile: File = null
  selectedFileAttrs = []

  selectedImportAttrs = []

  selectedSource: string = ""
  selectedImport: string = ""
  fileName: string

  schoolYear = ""
  semester = ""

  attrMapping = []

  tablesMap = {
    Attendance: 'ais_attendances',
    Grades: 'ais_grades',
    Admissions: 'ais_admissions',
    AdmissionsPoints: 'ais_admissions',
    StateExamsOverviews: 'ais_state_exams_overviews',
    StateExamsScenarios: 'ais_state_exams_scenarios',
    StudentsDataPt1: 'ais_students_data_pt1',
    StudentsDataPt2: 'ais_students_data_pt2',
  }

  disableImport: boolean = true

  constructor(
    private dataService: DataService,
    private titleService: Title,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.titleService.setTitle("Importovanie dát")
    this.dataService.getImportedYears()
    this.dataService.getImportedYearsUpdateListener()
      .subscribe(years => this.importedYears = years)
  }

  openAttrMapping() {
    const dialogRef = this.dialog.open(MappingDialogComponent, {
      width: '700px',
      data: {
        selectedFileAttrs: this.selectedFileAttrs,
        selectedImportAttrs: this.selectedImportAttrs
      }
    })

    dialogRef.afterClosed().subscribe(attrMapping => {
      this.attrMapping = attrMapping
    });
  }

  addFile() {
    this.fileInput.nativeElement.click()
  }

  onUpload() {
    this.dataService.uploadData(this.selectedFile, this.selectedImport, this.selectedSource, this.schoolYear, this.attrMapping)
    this.dataService.loading = true
    this.resetForm()
  }

  onFileSelected(event) {
    this.dataService.getAttrNames(this.tablesMap[this.selectedImport])
      .subscribe((attrs: any) => {
        this.selectedImportAttrs = attrs
      })

    this.selectedFile = <File>event.target.files[0]
    this.fileName = event.target.files[0] ? event.target.files[0].name : ""

    let arrayBuffer
    let fileReader = new FileReader()
    fileReader.onload = (e) => {
        arrayBuffer = fileReader.result
        var data = new Uint8Array(arrayBuffer)
        var arr = new Array()
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i])
        var bstr = arr.join("")
        var workbook = XLSX.read(bstr, {type:"binary"})
        var first_sheet_name = workbook.SheetNames[0]
        var worksheet = workbook.Sheets[first_sheet_name]
        this.selectedFileAttrs = XLSX.utils.sheet_to_csv(worksheet, {FS: '|'}).split("\n")[0].split("|")
        this.selectedFileAttrs = this._adjustKeys(this.selectedFileAttrs)
    }
    fileReader.readAsArrayBuffer(this.selectedFile)

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

  _adjustKeys(attrs) {
    let newAttrs = []
    for (let attr of attrs) {

      if(!attr) continue

      let newAttr = attr
        .trim()
        .split(".").join("")
        .split(":").join("")
        .split(" ").join("_")
        .split("-").join("_")
        .split("(").join("")
        .split(")").join("")
        .replace(/_+/g, '_')
        .replace(/\s/g, "_")
      newAttrs.push(newAttr)
    }
    return newAttrs;
  }
}

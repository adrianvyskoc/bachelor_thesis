import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Title } from '@angular/platform-browser';

import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material';
import { MappingDialogComponent } from './mapping-dialog/mapping-dialog.component';
import { TocUtil } from 'src/app/plugins/utils/toc.utll';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;


  selectedFile: File = null
  selectedFileAttrs = []

  selectedImportAttrs = []
  selectedImportYears = []

  selectedSource: string = ""
  selectedImport: string = ""
  fileName: string

  schoolYear = ""
  semester = ""

  attrMapping = []

  tablesMap = {
    // AIS
    Attendance: 'ais_attendances',
    Grades: 'ais_grades',
    Admissions: 'ais_admissions',
    AdmissionsPoints: 'ais_admissions',
    StateExamsOverviews: 'ais_state_exams_overviews',
    StateExamsScenarios: 'ais_state_exams_scenarios',
    StudentsDataPt1: 'ais_students_data_pt_1',
    StudentsDataPt2: 'ais_students_data_pt_2',

    // INEKO
    Schools: 'ineko_schools',
    Percentils: 'ineko_percentils',
    TotalRating: 'ineko_total_ratings',
    Pointers: 'ineko_individual_pointer_values',
    AdditionalData: 'ineko_additional_data'
  }

  disableImport: boolean = true

  constructor(
    private dataService: DataService,
    private titleService: Title,
    public dialog: MatDialog,
    private tocUtil: TocUtil
  ) {}

  ngOnInit() {
    this.tocUtil.noToc()
    this.titleService.setTitle("Importovanie dát")
  }

  openAttrMapping() {
    const dialogRef = this.dialog.open(MappingDialogComponent, {
      width: '700px',
      data: {
        attrMapping: this.attrMapping,
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

  onFormChange(callAttrsAndYears = false) {
    if(callAttrsAndYears) {
      this.dataService.getAttrNames(this.tablesMap[this.selectedImport])
        .subscribe((attrsAndYears: any) => {
          this.selectedImportAttrs = attrsAndYears.attrs
          this.selectedImportYears = attrsAndYears.years
        })
    }

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

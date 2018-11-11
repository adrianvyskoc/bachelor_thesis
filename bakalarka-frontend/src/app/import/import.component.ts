import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;


  selectedFile: File = null;
  selectedImport: string = "";
  selectedAction: string = "";
  fileName: string;

  constructor(private http: HttpClient, private dataService: DataService) {}

  ngOnInit() {
  }

  addFile() {
    this.fileInput.nativeElement.click();
  }

  onUpload() {
    this.dataService.uploadData(this.selectedFile, this.selectedImport, this.selectedAction);
    this.dataService.loading = true;
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    this.fileName = event.target.files[0].name;
  }

}

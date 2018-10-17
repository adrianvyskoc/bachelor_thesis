import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;


  selectedFile: File = null;
  selectedImport: string = "";
  fileName: string;

  

  constructor(private http: HttpClient, private dataService: DataService) {}

  ngOnInit() {
  }

  addFile() {
    this.fileInput.nativeElement.click();
  }

  onUpload() {
    this.dataService.uploadData(this.selectedFile, this.selectedImport);
    this.dataService.loading = true;
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    this.fileName = event.target.files[0].name;
  }

  test () {
    console.log("kliknute")
    this.dataService.test();
  }
}

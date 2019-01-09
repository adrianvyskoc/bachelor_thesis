import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  // exportovanie viacerých tabuliek do excelu
  exportMultipleTablesToExcel(tables, filename) {
    const toExport = Array.from(tables).reduce((acc, table: Element) => {
      acc += table.querySelector("thead").outerHTML
      acc += table.querySelector("tbody").outerHTML
      acc += '<tr><td></td></tr>'
      return acc
    }, '')

    var workbook = XLSX.read('<table>' + toExport + '</table>', {type:'string'});
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  // exportovanie jednej HTML tabuľky do excelu (xlsx)
  exportTableToExcel(table, filename) {
    const workbook: XLSX.WorkBook  = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
}

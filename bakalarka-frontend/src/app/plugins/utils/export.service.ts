import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * Funkcia na exportovanie viacerých tabuliek do excelu (xlsx).
   * @param tables - pole tabuliek, ktoré majú byť exportované do excelu
   * @param filename - názov vytvoreného súboru
   * @param tableObjects - pole tabuliek, ktore chceme xportovat z pola objektov
   *  Štruktura:
   *  [
   *    {
   *      data: // data ktore exportujeme
   *      attrs: // atributy, ktore chceme exportovať (ak neuvedieme, exportuju sa všetky)
   *    },
   *    ...
   *  ]
   * @param sheets - každá tabuľka na novom hárku, alebo nie (true - ano, false - nie)
   */
  exportMultipleTablesToExcel(tables, filename, tableObjects = [], sheets = true) {
    let workbook
    let i = 1

    if(sheets) {

      workbook = XLSX.utils.book_new()
      tables.forEach((table) => {
        let worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table)

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet' + i++)
      })

      // preiterovanie objektov, ktore chceme exportovat do xlsx
      tableObjects.forEach((tableObject) => {
        // ak mame uveden atributy, ktore chceme exportovat, vyberieme ich, ak nie preskocime
        if(tableObject.attrs) {
          tableObject.data = tableObject.data.map(item => {
            let newItem = {}
            tableObject.attrs.forEach(attr => {
              newItem[attr] = item[attr]
            })
            return newItem
          })
        }

        let worksheet = XLSX.utils.json_to_sheet(tableObject.data)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet' + i++)
      })

    } else {
      const toExport = Array.from(tables).reduce((acc, table: Element) => {
        acc += table.querySelector("thead").outerHTML
        acc += table.querySelector("tbody").outerHTML
        acc += '<tr><td></td></tr>'
        return acc
      }, '')

      workbook = XLSX.read('<table>' + toExport + '</table>', {type:'string'})

    }

    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  /**
   * Funkcia na exportovanie jednej HTML tabuľky do excelu (xlsx).
   * @param table - tabuľka, ktorá má byť exportovaná
   * @param filename - názov vytvoreného súboru
   */
  exportTableToExcel(table, filename) {
    const workbook: XLSX.WorkBook  = XLSX.utils.book_new()
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table)

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  /**
   * Funkcia na exportovanie poľa objektov do excelu (xlsx).
   * @param data - pole objektov, ktoré má byť exportované.
   * @param filename - názov vytvoreného súboru.
   */
  exportArrayOfObjectToExcel(data, filename, attrs = []) {
    const workbook: XLSX.WorkBook  = XLSX.utils.book_new()

    let worksheet: XLSX.WorkSheet
    if(attrs.length) {
      data = data.map(item => {
        let newItem = {}
        attrs.forEach(attr => {
          newItem[attr] = item[attr]
        })
        return newItem
      })
    }

    worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }
}

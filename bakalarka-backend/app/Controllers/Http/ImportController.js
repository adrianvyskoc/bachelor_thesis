'use strict'

const xlsx = use('xlsx')
const Excel = use('exceljs')
const Helpers = use('Helpers')
const Database = use('Database')
const fs = use('fs');

// Models
const Attendance = use('App/Models/Attendance')
const Student = use('App/Models/Student')
const Grade = use('App/Models/Grade')
const School = use('App/Models/School')


class ImportController {
    async getTest ({ view }) {
        return view.render("import");
    }

    async read ({ request, response }) {
        var workbook = new Excel.Workbook();
        await workbook.xlsx.readFile("/Users/adrianvyskoc/Desktop/datasety/zoznam_skol.xlsx")
    }

    async import ({ request, response, params }) {
        const config = {
            //sheetRows: 11,
            type: "string",
            cellFormula: false,		// formula format
            cellHTML: false,		// html format
            cellText: false			// formatted text format
        }

        // upload a file
        const xlsxFile = request.file(params.selectedImport)
        await xlsxFile.move(Helpers.tmpPath('uploads'), {
            name: params.selectedImport + '.xlsx'
        })
        if (!xlsxFile.moved()) {
            return xlsxFile.error()
        }
        
        // excel
        const workbook = xlsx.readFile(`tmp/uploads/${params.selectedImport}.xlsx`, config)
        const sheet_name_list = workbook.SheetNames
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])

        // delete old data
        switch(params.selectedImport) {
            case 'Attendance':
                await Database.truncate('attendances')
                break
            case 'Grades':
                await Database.truncate('grades')
                break
        }

        // import rows
        if(params.selectedImport == 'Attendance') {
            for (let row of rows) {
                const { STUDENT, STUDIUM, ...attendanceRow } = row
                const [ PRIEZVISKO, MENO ] = STUDENT.split(" ");

                let student = new Student()
                student.fill({
                    AIS_ID: attendanceRow.AIS_ID,
                    PRIEZVISKO, 
                    MENO, 
                    STUDIUM
                })
                
                try {
                    await student.save()
                } catch(err) {
                    console.log("err");
                }

                let attendance = new Attendance()
                attendance.fill(attendanceRow)
                attendance.created_at = null
                attendance.updated_at = null
                await attendance.save()
            } 
        } else if (params.selectedImport == 'Grades') {
            for (let row of rows) {
                const { PRIEZVISKO, MENO, STUDIUM, ROCNIK, ...gradeRow } = row

                let grade = new Grade()
                grade.fill(gradeRow)
                grade.created_at = null
                grade.updated_at = null
                await grade.save()
            } 
        } else if (params.selectedImport == 'Schools') {
            for (let row of rows) {
                for (const prop of Object.keys(row)) {
                    if(prop.indexOf('__EMPTY') > -1) delete row[prop];
                }

                let school = new School()
                school.fill(row)
                school.created_at = null
                school.updated_at = null
                try {
                    await school.save()
                } catch(err) {
                    console.log(err);
                }
            } 
        }

        // delete uploaded xlsx file
        deleteFile(Helpers.tmpPath('uploads'), params.selectedImport);
    }
}

function deleteFile(path, selectedImport) {
    fs.unlink(path + `/${selectedImport}.xlsx`, function(err) {
        if(err) console.log(err)
    })
}


module.exports = ImportController

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
const Admission = use('App/Models/Admission')


class ImportController {

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
        if(params.selectedAction == "delete") {
            switch(params.selectedImport) {
                case 'Attendance':
                    await Database.truncate('attendances')
                    break
                case 'Grades':
                    await Database.truncate('grades')
                    break
            }
        }
        
        // import rows
        if(params.selectedImport == 'Attendance') {
            for (let row of rows) {
                const { STUDENT, STUDIUM, ...attendanceRow } = row
                const [ PRIEZVISKO, MENO ] = STUDENT.split(" ");

                const studentData = {
                    AIS_ID: attendanceRow.AIS_ID,
                    PRIEZVISKO, 
                    MENO, 
                    STUDIUM
                }
                let student = new Student()
                student.fill(studentData)
                
                try {
                    await student.save()
                } catch(err) {
                    if(params.selectedAction == "update") {
                        await Database.table('students').where('AIS_ID', studentData.AIS_ID).update(studentData)
                    }
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

                const studentData = {
                    AIS_ID: gradeRow.AIS_ID,
                    PRIEZVISKO, 
                    MENO, 
                    STUDIUM,
                    ROCNIK
                }
                let student = new Student()
                student.fill(studentData)
                
                try {
                    await student.save()
                } catch(err) {
                    if(params.selectedAction == "update") {
                        await Database.table('students').where('AIS_ID', studentData.AIS_ID).update(studentData)
                    } else {
                        console.log("tu som")
                    }
                }

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
                } catch(err) {}
            } 
        } else if (params.selectedImport == 'Admissions') {
            //return response.send(rows)
            for (let row of rows) {
                row = adjustKeys(row);

                let admission = new Admission()
                admission.fill(row)
                admission.created_at = null
                admission.updated_at = null
                try {
                    await admission.save()
                } catch(err) {}
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

function adjustKeys(obj) {
    let newObj = {}
    for (let key in obj) {
        let newKey = key.split(".").join("").split(" ").join("_")
        newObj[newKey] = obj[key]
    }

    return newObj;
}

module.exports = ImportController

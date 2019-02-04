'use strict'

const xlsx = use('xlsx')
const Helpers = use('Helpers')
const Database = use('Database')
const fs = use('fs');

// Models
const Attendance = use('App/Models/Attendance')
const Student = use('App/Models/Student')
const Grade = use('App/Models/Grade')
const Admission = use('App/Models/Admission')

class ImportAisController {

    async read ({ request, response }) {
        const config = {
            sheetRows: 11,
            type: "string",
            cellFormula: false,		// formula format
            cellHTML: false,		// html format
            cellText: false			// formatted text format
        }


        const workbook = xlsx.readFile(`tmp/uploads/scenar_komisii.xlsx`, config)
        const sheet_name_list = workbook.SheetNames
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])

        return response.send(rows)
    }

    async import ({ request, params }) {

        console.log(params.year)

        const config = {
            //sheetRows: 11,
            type: "string",
            cellFormula: false,		// formula format
            cellHTML: false,		// html formats
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

/*
 *  import rows start ------------------------------------------------------------------------------------------
 */

        // -------------------------------------------------------------------
        // Attendances
        // -------------------------------------------------------------------

        if(params.selectedImport == 'Attendance') {
            for (let row of rows) {
                const { STUDENT, STUDIUM, ...attendanceRow } = row
                const [ PRIEZVISKO, MENO ] = STUDENT.split(" ");

                attendanceRow.OBDOBIE = params.year

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

                try {
                    await attendance.save()
                } catch(err) { console.log(err) }            }
        }

        // -------------------------------------------------------------------
        // Grades
        // -------------------------------------------------------------------

        if (params.selectedImport == 'Grades') {
            for (let row of rows) {
                const { PRIEZVISKO, MENO, STUDIUM, ROCNIK, ...gradeRow } = row

                gradeRow.OBDOBIE = params.year

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

                try {
                    await grade.save()
                } catch(err) { console.log(err) }
            }
        }

        // -------------------------------------------------------------------
        // Admissions
        // -------------------------------------------------------------------

        if (params.selectedImport == 'Admissions') {
            for (let row of rows) {
                row = adjustKeys(row);

                /*if(row['Prijatie_na_program']) {
                  let student = new Student()

                  student.fill({
                    AIS_ID: row['Používateľ_podľa_RČ'].split(" ")[0],
                    SCHOOL_ID: row['SŠ_kód'],
                    MENO: row['Meno'],
                    PRIEZVISKO: row['Priezvisko'],
                    STUDIUM: row['Prijatie_na_program']
                  })

                  try {
                    await student.save()
                  } catch (err) { console.log(err) }
                }*/

                if(row.SŠ_kód) {
                  const schools = await Database.table('ineko_schools').where('kod_kodsko', row.SŠ_kód).count()
                  row.school_id = schools[0].count != '0' ? row.SŠ_kód : null
                }

                let admission = new Admission()

                //row.AIS_ID = row['Používateľ_podľa_RČ'].split(" ")[0]
                row.č_d = String(row.č_d)
                row.č_d_1 = String(row.č_d_1)
                row.Odbor_SŠ = String(row.Odbor_SŠ)
                row.OBDOBIE = params.year

                delete row['Druh_SŠ']
                delete row['Používateľ_podľa_RČ'] // z tohto ziskat ais ID
                delete row['SŠ_kód']

                admission.fill(row)

                try {
                  await admission.save()
                } catch (err) { console.log(err) }
            }
        }

/*
 *  import rows end ------------------------------------------------------------------------------------------
 */

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
        let newKey = key
            .split(".").join("")
            .split(" ").join("_")
            .split("-").join("_")
            .split("(").join("")
            .split(")").join("")
            .replace(/_+/g, '_')
        newObj[newKey] = obj[key]
    }

    return newObj;
}

module.exports = ImportAisController

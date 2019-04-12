'use strict'

const xlsx = use('xlsx')
const Helpers = use('Helpers')
const Database = use('Database')
const fs = use('fs')
//const Redis = use('Redis')

// Models
const Student = use('App/Models/Student')
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

                attendanceRow.created_at = null
                attendanceRow.updated_at = null

                try {
                    await Database.table('ais_attendances').insert(attendanceRow)
                } catch(err) { console.log(err) }
            }
        }

        // -------------------------------------------------------------------
        // Grades
        // -------------------------------------------------------------------

        const attrsToDeleteGrades = [ 'KOD', 'KREDITY', 'STAV_ZAPISU', 'UKONCENIE', 'PREDMET' ]

        if (params.selectedImport == 'Grades') {
            for (let row of rows) {
                const { PRIEZVISKO, MENO, STUDIUM, ROCNIK, ...gradeRow } = row

                gradeRow.OBDOBIE = params.year

                for(const prop of attrsToDeleteGrades) {
                    delete gradeRow[prop]
                }

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
                    }
                }

                try {
                    await Database.table('ais_grades').insert(gradeRow)
                } catch(err) { console.log(err) }
            }
        }

        // -------------------------------------------------------------------
        // Admissions
        // -------------------------------------------------------------------

        if (params.selectedImport == 'Admissions') {
            for (let row of rows) {
                row = adjustKeys(row)

                /*if(row['Rozh'] == 11 || row['Rozh'] == 10 || row['Rozh'] == 13) {
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

                if(row['Používateľ_podľa_RČ'])
                  row.AIS_ID = Number(row['Používateľ_podľa_RČ'].split(" ")[0])

                row.č_d = String(row.č_d)
                row.č_d_1 = String(row.č_d_1)
                row.Odbor_SŠ = String(row.Odbor_SŠ)
                row.OBDOBIE = params.year
                row.stupen_studia = row.Program_1[0] == 'B' ? 'Bakalársky' : 'Inžiniersky'

                delete row['Druh_SŠ']
                delete row['Používateľ_podľa_RČ'] // z tohto ziskat ais ID
                delete row['SŠ_kód']

                admission.fill(row)

                try {
                  await admission.save()
                } catch (err) { console.log(err) }
            }



        //     let importedYears = await Redis.get(params.selectedImport)
        //     importedYears = JSON.parse(importedYears)

        //     if(!importedYears) importedYears = []

        //     if(importedYears.indexOf(params.year) == -1)
        //       await Redis.set(params.selectedImport, JSON.stringify([...importedYears, params.year]))
        }

        // -------------------------------------------------------------------
        // Admissions points
        // -------------------------------------------------------------------

        if(params.selectedImport == 'AdmissionsPoints') {
          for (let row of rows) {
            row = adjustKeys(row)

            var {
              Externá_maturita_z_cudzieho_jazyka_ECJ,
              Externá_maturita_z_matematiky_EM,
              Písomný_test_z_matematiky_SCIO_PTM,
              Všeobecné_študijné_predpoklady_SCIO_VŠP
            } = row

            var obj = {
              Externá_maturita_z_cudzieho_jazyka_ECJ,
              Externá_maturita_z_matematiky_EM,
              Písomný_test_z_matematiky_SCIO_PTM,
              Všeobecné_študijné_predpoklady_SCIO_VŠP
            }

            let attrs = ['Externá_maturita_z_cudzieho_jazyka_ECJ', 'Externá_maturita_z_matematiky_EM', 'Písomný_test_z_matematiky_SCIO_PTM', 'Všeobecné_študijné_predpoklady_SCIO_VŠP']

            attrs.forEach((attr) => {
              if(typeof obj[attr] == "number")
                return

              if(typeof obj[attr] !== "string") {
                obj[attr] = null
              } else {
                if(obj[attr].trim().length)
                  obj[attr] = Number(obj[attr])
                else
                  obj[attr] = null
              }
            })

            try {
              await Database
              .table('ais_admissions')
              .where({ 'Reg_č': row['Reg_č'], OBDOBIE: params.year })
              .update(obj)
            } catch (err) { console.log(err) }

          }
        }

        // -------------------------------------------------------------------
        // StateExamsOverviews
        // -------------------------------------------------------------------

        if(params.selectedImport == 'StateExamsOverviews') {
          for(let row of rows) {
            row = adjustKeys(row)

            row['AIS_ID'] = row['ID']
            row['OBDOBIE'] = params.year

            delete row['ID']
            delete row['Por']

            row['VŠP_štúdium'] = toNumber(row['VŠP_štúdium'])
            row['VŠP_štud_bpo'] = toNumber(row['VŠP_štud_bpo'])

            try {
              await Database.table('ais_state_exams_overviews').insert(row)
            } catch(err) { console.log(err) }
          }
        }

        // -------------------------------------------------------------------
        // StateExamsScenarios
        // -------------------------------------------------------------------

        if(params.selectedImport == 'StateExamsScenarios') {
          for(let row of rows) {
            for (const prop of Object.keys(row)) {
              if(prop.indexOf('__EMPTY') > -1) delete row[prop];
            }

            row = adjustKeys(row)

            row['OBDOBIE'] = params.year

            try {
              await Database.table('ais_state_exams_scenarios').insert(row)
            } catch(err) { console.log(err) }
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

    if(!key) continue

    let newKey = key
      .trim()
      .split(".").join("")
      .split(":").join("")
      .split(" ").join("_")
      .split("-").join("_")
      .split("(").join("")
      .split(")").join("")
      .replace(/_+/g, '_')
      .replace(/\s/g, "_")
    newObj[newKey] = obj[key]
  }
  return newObj;
}

function toNumber(num) {
  if(!num)
    return null

  return Number(num.trim().replace(",", "."))
}

module.exports = ImportAisController

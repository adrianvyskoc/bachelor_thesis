'use strict'

const xlsx = use('xlsx')
const Helpers = use('Helpers')
const Database = use('Database')
const fs = use('fs')

// Models
const Student = use('App/Models/Student')
const Admission = use('App/Models/Admission')

class ImportAisController {

    async import ({ request, params }) {

        const config = {
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

        // delete uploaded xlsx file
        deleteFile(Helpers.tmpPath('uploads'), params.selectedImport)

        // mapovanie atribútov, ak nejaké existuje
        const data = await request.all()
        const mapping = JSON.parse(data.mapping)

        if(mapping && mapping.length) {
          mapping.reduce((acc, item) => {
            acc[item.from] = item.to
            return acc
          }, {})

          rows.forEach((row, idx) => {
            rows[idx] = adjustKeys(rows[idx])
            for(let mp of mapping) {
              rows[idx][mp.to] = rows[idx][mp.from]
              delete rows[idx][mp.from]
            }
          })
        }

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

                attendanceRow.OBDOBIE = data.year

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

                gradeRow.OBDOBIE = data.year

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

                let schools
                if(row.SŠ_kód) {
                  schools = await Database.table('ineko_schools').where('kod_kodsko', row.SŠ_kód).count()
                  row.school_id = schools[0].count != '0' ? row.SŠ_kód : null
                }

                if((row['Rozh'] == 11 || row['Rozh'] == 10 || row['Rozh'] == 13) && row['Používateľ_podľa_RČ'] && row['Štúdium'] == 'áno') {
                  let student = new Student()

                  try {
                    const studentData = {
                      AIS_ID: row['Používateľ_podľa_RČ'].split(" ")[0],
                      SCHOOL_ID: row.SŠ_kód && schools[0].count != '0' ? row.SŠ_kód : null,
                      MENO: row['Meno'],
                      PRIEZVISKO: row['Priezvisko'],
                      STUDIUM: row['Prijatie_na_program']
                    }

                    student.fill(studentData)

                    let students = await Database.table('ais_students').where('AIS_ID', studentData.AIS_ID).count()

                    if(students[0].count == '0')
                      await student.save()
                    else {
                      await Database
                        .table('ais_students')
                        .where({ 'AIS_ID': studentData.AIS_ID })
                        .update(studentData)
                    }
                    row.AIS_ID = Number(row['Používateľ_podľa_RČ'].split(" ")[0])
                  } catch (err) { console.log(err) }
                }

                let admission = new Admission()

                row.č_d = String(row.č_d)
                row.č_d_1 = String(row.č_d_1)
                row.Odbor_SŠ = String(row.Odbor_SŠ)
                row.Body = toNumber(row.Body)
                row.Body_celkom = toNumber(row.Body_celkom)
                row.OBDOBIE = data.year
                row.stupen_studia = row.Program_1[0] == 'B' ? 'Bakalársky' : 'Inžiniersky'

                delete row['Druh_SŠ']
                delete row['Používateľ_podľa_RČ']
                delete row['SŠ_kód']

                admission.fill(row)

                try {
                  await admission.save()
                } catch (err) { console.log(err) }
            }
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
              .where({ 'Reg_č': row['Reg_č'], OBDOBIE: data.year })
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
            row['OBDOBIE'] = data.year

            if(row['ID']) {
              let students = await Database.table('ais_students').where('AIS_ID', row['ID']).count()

              let studentData = {
                AIS_ID: row['ID'],
                PRIEZVISKO: row.Celé_meno_s_titulmi.split(",")[0].split(" ")[0],
                MENO: row.Celé_meno_s_titulmi.split(",")[0].split(" ")[1]
              }

              try {
                if(students[0].count == '0') {
                  let student = new Student()
                  student.fill(studentData)
                  await student.save()
                }
                else {
                  await Database
                    .table('ais_students')
                    .where({ 'AIS_ID': studentData.AIS_ID })
                    .update(studentData)
                }
              } catch(err) {console.log(err)}
            }

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
        // StateExamsOverviewsIng
        // -------------------------------------------------------------------
        
        if(params.selectedImport == 'StateExamsOverviewsIng') {
          for(let row of rows) {
            console.log(row)
            for (const prop of Object.keys(row)) {
              if(prop.indexOf('__EMPTY') > -1) delete row[prop];
            }

            row = adjustKeys(row)

            row['AIS_ID'] = row['ID']
            row['OBDOBIE'] = data.year

            if(row['ID']) {
              let students = await Database.table('ais_students').where('AIS_ID', row['ID']).count()

              let studentData = {
                AIS_ID: row['ID'],
                PRIEZVISKO: row.Celé_meno_s_titulmi.split(",")[0].split(" ")[0],
                MENO: row.Celé_meno_s_titulmi.split(",")[0].split(" ")[1]
              }

              try {
                if(students[0].count == '0') {
                  let student = new Student()
                  student.fill(studentData)
                  await student.save()
                }
                else {
                  await Database
                    .table('ais_students')
                    .where({ 'AIS_ID': studentData.AIS_ID })
                    .update(studentData)
                }
              } catch(err) {console.log(err)}
            }

            delete row['ID']
            // delete row['Por']

            row['VŠP_štúdium'] = toNumber(row['VŠP_štúdium'])
            row['VŠP_štud_bpo'] = toNumber(row['VŠP_štud_bpo'])

            try {
              await Database.table('ais_state_exams_overview_ings').insert(row)

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

            row['OBDOBIE'] = data.year

            try {
              await Database.table('ais_state_exams_scenarios').insert(row)
            } catch(err) { console.log(err) }
          }
        }

        // -------------------------------------------------------------------
        // StateExamsScenariosIng
        // -------------------------------------------------------------------

        if(params.selectedImport == 'StateExamsScenariosIng') {
          for(let row of rows) {
            // console.log(row)

            for (const prop of Object.keys(row)) {
              if(prop.indexOf('__EMPTY') > -1) delete row[prop];
            }

            row = adjustKeys(row)

            row['OBDOBIE'] = data.year

            try {
              await Database.table('ais_state_exams_scenario_ings').insert(row)
            } catch(err) { console.log(err) }
          }
        }


        // -------------------------------------------------------------------
        // Students data part 1
        // -------------------------------------------------------------------

        if(params.selectedImport == 'StudentsDataPt1') {
          for(let row of rows) {
            for (const prop of Object.keys(row)) {
              if(prop.indexOf('__EMPTY') > -1) delete row[prop];
            }

            Object.keys(row).forEach((key) => {
              if(row[key] == " ")
                row[key] = null
            })

            row = adjustKeys(row)

            if(row['ID']) {
              let students = await Database.table('ais_students').where('AIS_ID', row['ID']).count()

              let studentData = {
                AIS_ID: row['ID'],
                PRIEZVISKO: row.Celé_meno_s_titulmi.split(",")[0].split(" ")[0],
                MENO: row.Celé_meno_s_titulmi.split(",")[0].split(" ")[1]
              }

              try {
                if(students[0].count == '0') {
                  let student = new Student()
                  student.fill(studentData)
                  await student.save()
                }
                else {
                  await Database
                    .table('ais_students')
                    .where({ 'AIS_ID': studentData.AIS_ID })
                    .update(studentData)
                }
              } catch(err) {console.log(err)}
            }

            row['OBDOBIE'] = data.year
            row['SEMESTER'] = data.semester
            
            // let tmp2 = [];
            // if (row.Dátum_splnenia !== undefined || row.Dátum_splnenia !== null) {
            //   tmp2 = row.Dátum_splnenia.trim().split('.');
            // }
            // console.log(row.Dátum_splnenia)
            // row['rokSplnenia'] = tmp2.pop();

            let tmp = [];
            if (row.Nástup !== undefined || row.Nástup !== null) {
              tmp = row.Nástup.split('.');
            }
            row['rokNastupu'] = tmp.pop();

            delete row['Por']

            let toNumberAttrs = [
              "Priemer", "Priemer_4", "Priem_2_obd_4", "Priem_ar_4", "Priem_štúdium", "Priem_štúd_bez_posl_o",
              "Priem_št_4_bez_posl_o", "Priem_štúdium_4", "Priemer_štip_ZF", "Bod_priemer", "Body_PS", "Extrabody_PZ",
              "IpŠp", "IpŠp_min_ar"
            ]

            try {
              toNumberAttrs.forEach((attr) => {
                row[attr] = toNumber(row[attr])
              })
            } catch(err) {
              //console.log(err)
            }

            try {
              await Database.table('ais_students_data_pt_1').insert(row)
            } catch(err) { console.log(err) }
          }
        }

        // -------------------------------------------------------------------
        // Students data part 2
        // -------------------------------------------------------------------

        if(params.selectedImport == 'StudentsDataPt2') {
          for(let row of rows) {
            for (const prop of Object.keys(row)) {
              if(prop.indexOf('__EMPTY') > -1) delete row[prop];
            }

            Object.keys(row).forEach((key) => {
              if(row[key] == " ")
                row[key] = null
            })

            row = adjustKeys(row)

            if(row['ID']) {
              let students = await Database.table('ais_students').where('AIS_ID', row['ID']).count()

              let studentData = {
                AIS_ID: row['ID'],
                PRIEZVISKO: row.Celé_meno_s_titulmi.split(",")[0].split(" ")[0],
                MENO: row.Celé_meno_s_titulmi.split(",")[0].split(" ")[1]
              }

              try {
                if(students[0].count == '0') {
                  let student = new Student()
                  student.fill(studentData)
                  await student.save()
                }
                else {
                  await Database
                    .table('ais_students')
                    .where({ 'AIS_ID': studentData.AIS_ID })
                    .update(studentData)
                }
              } catch(err) {console.log(err)}
            }

            row['OBDOBIE'] = data.year
            row['SEMESTER'] = data.semester

            delete row['Por']

            let toNumberAttrs = [
              "Percentil_ob_+_roč", "Perc_zhody", "Percentil_prog_+_roč", "Priemer", "Priemer_SŠ", "VŠP", "VŠP_4", "VŠP_2_obd",
              "VŠP_2_obd_4", "VŠP_ar", "VŠP_ar_4", "VŠP_štúdium", "VŠP_štud_bpo", "VŠP_štúdium_4", "VSP_štud_4_bpo", "VŠP_min_ar_4",
              "VŠP_min_ar", "VŠP_min_ar_4_1", "VŠP_posl_obd", "VŠP_posl_obd_4", "VŠP_posl_obd_4_1", "Architektúra_počítačov",
              "Databázové_systémy", "Externá_maturita_z_cudzieho_jazyka_ECJ", "Externá_maturita_z_matematiky_EM",
              "Externá_maturita_z_cudzieho_jazyka", "Externá_maturita_z_matematiky", "Písomný_test_z_matematiky_SCIO_PTM",
              "Princípy_softvérového_inžinierstva", "Programovanie_a_počítačové_systémy", "Test_z_matematiky_SCIO_PTM",
              "Test_z_matematiky_SCIO", "Všeobecné_študijné_predpoklady_SCIO", "Všeobecné_študijné_predpoklady_SCIO_VŠP"
            ]

            try {
              toNumberAttrs.forEach((attr) => {
                row[attr] = toNumber(row[attr])
              })
            } catch(err) {
              //console.log(err)
            }

            try {
              await Database.table('ais_students_data_pt_2').insert(row)
            } catch(err) { console.log(err) }
          }
        }

/*
 *  import rows end ------------------------------------------------------------------------------------------
 */
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

  if(typeof num == "number")
    return num

  return Number(num.trim().replace(",", "."))
}

module.exports = ImportAisController

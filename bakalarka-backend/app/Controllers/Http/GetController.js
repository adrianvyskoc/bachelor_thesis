'use strict'

const Database = use('Database')
//const Redis = use('Redis')

const Student = use('App/Models/Student')
const Attendance = use('App/Models/Attendance')
const Admission = use('App/Models/Admission')
const AttendanceType = use('App/Models/AttendanceType')
const StudyForm = use('App/Models/StudyForm')
const HighSchoolType = use('App/Models/HighSchoolType')
const Grade = use('App/Models/Grade')
const Subject = use('App/Models/Subject')
const School = use('App/Models/School')
const Pointer = use('App/Models/Pointer')
const Admin = use('App/Models/Admin')

class GetController {
    async getImportedYears ({ response }) {
        // INEKO
        // const AdditionalData = JSON.parse(await Redis.get('AdditionalData'))
        // const TotalRating = JSON.parse(await Redis.get('TotalRating'))
        // const Percentils = JSON.parse(await Redis.get('Percentils'))
        // const Pointers = JSON.parse(await Redis.get('Pointers'))

        // AIS
        // const Admissions = await Redis.get('Admissions')

        // return response.send({
        //   'ineko': {
        //     TotalRating,
        //     Percentils,
        //     Pointers,
        //     AdditionalData
        //   },
        //   'ais': {
        //     Admissions
        //   }
        // })
        return response.send({

        })
    }

    async getStudents ({ response }) {
        const students = await Student.all()

        return response.send(students)
    }

    async getAttendance ({ response }) {
        const attendance = await Attendance.all()

        return response.send(attendance)
    }

    async getAdmissions ({ response, params }) {
        let admissions
        if(params.year == 'all')
          admissions = await Database
            .select('*')
            .from('ais_admissions')
            .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
        else
          admissions = await Database
            .select('*')
            .from('ais_admissions')
            .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
            .where('OBDOBIE', params.year)

        return response.send(admissions)
    }

    async getAdmission ({ response, params }) {
        const admission = await Admission.find(params.id)
        const school = await School.find(admission.school_id)
        const pointers = await Database.table('ineko_individual_pointer_values').where('school_id', admission.school_id)
        const otherAdmissions = await Database.table('ais_admissions').where('AIS_ID', admission.AIS_ID)

        return response.send({
            admission,
            school,
            pointers,
            otherAdmissions
        })
    }

    // ---
    // vrati userov ktori maju pristup do appky
    async getUsers({ response }) {
      try {
        const data = await Database
          .table('admins')
          .where({access: 'true'})
          .orderBy('id', 'desc') // zoradim to, aby ked pridam niekoho bol stale na vrchu v tabulke

          return response
          .status(200)
          .send(data)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    // prida usera a pristup do appky
    async addUser({ request, response}) {
      const user = request.body.name

      try {
        const existingRecords = await Admin
          .query()
          .where('email', user)
          .getCount()

        if(existingRecords > 0) {
          await Database
            .table('admins')
            .where({email: user})
            .update({access: 'true'})
        } else {
          await Database
            .table('admins')
            .insert({email: user, admin: 'false'})
        }
        return response
          .status(200)
          .send(true)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    // prida prava admina
    async addAdmin({ request, response }) {
      const user = request.body.name

      try {
        const existingRecords = await Admin
          .query()
          .where('email', user)
          .getCount()

        if(existingRecords > 0) {
          await Database
            .table('admins')
            .where({email: user})
            .update({admin: 'true'})
        } else {
          await Database
            .table('admins')
            .insert({email: user, admin: 'true'})
        }
        return response
          .status(200)
          .send(true)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    // vymaze prava admina
    async removeAdmin({ request, response }) {
      const user = request.body.name
      try {
        await Database
          .table('admins')
          .where({email: user})
          .update({admin: 'false'})

        return response
          .status(200)
          .send(true)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    // vymaze pristup do appky
    async removeUser({ request, response}) {
      const user = request.body.name
      try {
        await Database
        .table('admins')
        .where({email: user})
        .update({access: 'false'})

        return response
          .status(200)
          .send(true)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }
    // ---

    async getStateFinalExams ({ response }) {
      try {
        const data = await Database
          // .select('*', 'Celé_meno_s_titulmi as cmst')
          .select(
            'ais_state_exams_overviews.id as id',
            // 'ais_state_exams_overviews.Celé_meno_s_titulmi as celeMenoSTitulmi',
            'ais_state_exams_scenarios.Riešiteľ as riesitel',
            'ais_state_exams_overviews.AIS_ID as aisId',
            'ais_state_exams_overviews.Identifikácia_štúdia as identifikaciaStudia',
            'ais_state_exams_overviews.Obhajoba as obhajoba',
            'ais_state_exams_overviews.Záverečná_práca_názov as zaverecnaPracaNazov',
            'ais_state_exams_overviews.Vedúci as veduci',
            'ais_state_exams_overviews.Oponent as oponent',
            'ais_state_exams_overviews.Stav as stav',
            'ais_state_exams_overviews.VŠP_štúdium as vspStudium',
            'ais_state_exams_overviews.VŠP_štud_bpo as vspStudBpo',

            'ais_state_exams_scenarios.Vedúci as veduciHodnotenie',
            'ais_state_exams_scenarios.Oponent_1 as oponentHodnotenie',
            'ais_state_exams_scenarios.Výsledné_hodnotenie as vysledneHodnotenie',
            // 'ais_state_exams_overviews.test as test',


            // 'ais_state_exams_overviews.OBDOBIE as obdobie',
            // 'Celé_meno_s_titulmi as celeMenoSTitulmi',
            // 'Typ_proj as typProj',
            // 'Štud_prog as studProg',
            // 'Riešiteľ as riesitel',
            // 'Názov_projektu as nazovProjektu',
            // 'Vedúci_projektu as veduciProjektu',
            // 'Oponent_1 as oponent1',
            // 'Výsledné_hodnotenie as vysledneHodnotenie',
            'ais_state_exams_scenarios.dňa as dna',
            'ais_state_exams_scenarios.Komisia as komisia',
            'ais_state_exams_scenarios.Predseda as predseda',
            'ais_state_exams_scenarios.Tajomník as tajomnik'
          )
          .from('ais_state_exams_overviews')
          .leftJoin('ais_state_exams_scenarios', 'ais_state_exams_overviews.Záverečná_práca_názov', 'ais_state_exams_scenarios.Názov_projektu' )

        return response
          .status(200)
          .send(data)

      } catch(e) {
        console.log('error', e);
        return response
          .status(500)
          .send(e)
      }
    }

    // ---


    async getGrades ({ response }) {
        const grades = await Grade.all()

        return response.send(grades)
    }

    async getSubjects({ response }) {
        const subjects = await Subject.all()

        return response.send(subjects)
    }

    async getSchools({ response }) {
        const schools = await School.all()

        return response.send(schools)
    }

    async getCodebook ({ response, params }) {
        var codebook
        switch (params.type) {
            case 'attendanceTypes':
                codebook = await AttendanceType.all()
                break

            case 'studyForms':
                codebook = await StudyForm.all()
                break

            case 'highSchoolTypes':
                codebook = await HighSchoolType.all()
                break

            default:
                break
        }

        return response.send(codebook)
    }

    // API endpoints for usecases
    async getAdmissionsOverview ({ request, response }) {
      const queryParams = await request.all()

      const admissionsAttrs = [
        'ais_admissions.id',
        'ais_admissions.Meno',
        'ais_admissions.Priezvisko',
        'ais_admissions.E_mail',
        'ais_admissions.Všeobecné_študijné_predpoklady_SCIO_VŠP',
        'ais_admissions.Písomný_test_z_matematiky_SCIO_PTM',
        'ais_admissions.Externá_maturita_z_matematiky_EM',
        'ais_admissions.Externá_maturita_z_cudzieho_jazyka_ECJ',
        'ais_admissions.Program_1',
        'ais_admissions.Pohlavie',
        'ais_admissions.Maturita_1',
        'ais_admissions.school_id',
        'ais_admissions.stupen_studia',
        'ais_admissions.Body_celkom',
        'ais_admissions.Rozh'
      ]
      const schoolsAttrs = ['ineko_schools.typ_skoly', 'ineko_schools.sur_y', 'ineko_schools.sur_x', 'ineko_schools.kraj']

      const schools = await Database
        .select(...schoolsAttrs, 'ineko_schools.ulica', 'ineko_schools.nazov', 'ineko_schools.kod_kodsko', 'ineko_schools.email', 'ineko_total_ratings.celkove_hodnotenie')
        .from('ineko_schools')
        .join('ineko_total_ratings', 'ineko_total_ratings.school_id', 'ineko_schools.kod_kodsko')

      let admissions
      let regionMetrics

      if(queryParams.year == 'all') {
        admissions = await Database
          .select(...admissionsAttrs, ...schoolsAttrs)
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
        regionMetrics = await Database.raw(`
          SELECT
            COUNT(ais_admissions.id),
            AVG(ais_admissions."Body_celkom") as mean,
            percentile_disc(0.5) within group (order by ais_admissions."Body_celkom") as median,
            ineko_schools.kraj
          FROM ais_admissions
          JOIN ineko_schools ON ais_admissions.school_id = ineko_schools.kod_kodsko
          GROUP BY ineko_schools.kraj
          `
        )
      }
      else {
        admissions = await Database
          .select(...admissionsAttrs, ...schoolsAttrs)
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
          .where('OBDOBIE', queryParams.year)
        regionMetrics = await Database.raw(`
          SELECT
            COUNT(ais_admissions.id),
            AVG(ais_admissions."Body_celkom") as mean,
            percentile_disc(0.5) within group (order by ais_admissions."Body_celkom") as median,
            ineko_schools.kraj
          FROM ais_admissions
          JOIN ineko_schools ON ais_admissions.school_id = ineko_schools.kod_kodsko
          WHERE ais_admissions."OBDOBIE" = ?
          GROUP BY ineko_schools.kraj
          `, [queryParams.year]
        )
      }

      return response.send({ schools, admissions, regionMetrics: regionMetrics.rows })
    }

    async getAdmissionsYearComparison ({ response }) {
      //const years = await Redis.get('Admissions')
      const admissions = await Database
        .select('*')
        .from('ais_admissions')
        .where('stupen_studia', 'Bakalársky')

      let studyProgrammes = await Database.raw(`
        SELECT DISTINCT "Program_1" FROM ais_admissions
        WHERE stupen_studia = ?
      `, ['Bakalársky'])

      let years = await Database.raw(`
        SELECT DISTINCT "OBDOBIE" FROM ais_admissions
        WHERE stupen_studia = ?
      `, ['Bakalársky'])

      let ratios = {}
      ratios.approved = await Database.raw(`
        SELECT "OBDOBIE", COUNT("Rodné_číslo") AS apr FROM (
          SELECT DISTINCT "OBDOBIE", "Rodné_číslo" FROM ais_admissions
          WHERE "Rozh" = 10 OR "Rozh" = 11 OR "Rozh" = 13
        ) AS x
        GROUP BY "OBDOBIE"
      `)
      ratios.began_study = await Database.raw(`
        SELECT "OBDOBIE", COUNT("Rodné_číslo") AS bs FROM (
          SELECT DISTINCT "OBDOBIE", "Rodné_číslo" FROM ais_admissions
          WHERE ("Rozh" = 10 OR "Rozh" = 11 OR "Rozh" = 13) AND "Štúdium" = ?
        ) AS x
        GROUP BY "OBDOBIE"
      `, ['áno'])

      ratios.approved = ratios.approved.rows
      ratios.began_study = ratios.began_study.rows

      studyProgrammes = studyProgrammes.rows.map(programme => programme.Program_1)
      years = years.rows.map(year => year.OBDOBIE)

      // zoradenie školských rokov podľa abecedy
      years.sort(function (item1, item2) {
        return item1.localeCompare(item2);
      })

      return response.send({ admissions, years, studyProgrammes, ratios })
    }

    async getAdmissionsBachelor ({ request, response }) {
      const queryParams = await request.all()

      let schools
      if(queryParams.year !== 'all') {
        schools = await Database.raw(
            `
              SELECT sch.nazov, sch.druh_skoly, sch.kod_kodsko, tr.celkove_hodnotenie FROM ineko_schools AS sch
              JOIN ais_admissions AS adm ON adm.school_id = sch.kod_kodsko
              JOIN ineko_total_ratings AS tr ON tr.school_id = sch.kod_kodsko AND tr."OBDOBIE" = ?
              WHERE adm."OBDOBIE" = ?
            `, [queryParams.year, queryParams.year]
        )
      } else {
        schools = await Database.raw(
            `
              SELECT sch.nazov, sch.druh_skoly, sch.kod_kodsko, tr.celkove_hodnotenie FROM ineko_schools AS sch
              JOIN ineko_total_ratings AS tr ON tr.school_id = sch.kod_kodsko
            `
        )
      }

      let admissions
      if(queryParams.year == 'all') {
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
          .where('stupen_studia', 'Bakalársky')
      }
      else {
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
          .where('OBDOBIE', queryParams.year)
          .where('stupen_studia', 'Bakalársky')
      }

      return response.send({ schools: schools.rows, admissions })
    }

    async getAdmissionsMaster({ request, response }) {
      const queryParams = await request.all()

      let admissions
      if(queryParams.year == 'all') {
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .where('stupen_studia', 'Inžiniersky')
      } else {
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .where('OBDOBIE', queryParams.year)
          .where('stupen_studia', 'Inžiniersky')
      }

      return response.send({ admissions })
    }
}

module.exports = GetController

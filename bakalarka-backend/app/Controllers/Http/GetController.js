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

    async getAdmins({ response }) {
      try {
        const data = await Database
          .table('admins')
          .where({admin: 'true'})

          return response
          .status(200)
          .send(data)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    async addAdmin({ response, params }) {
      const user = params.name

      try {
        const existingRecords = await Admin
          .query()
          .where('email', user)
          .getCount()

        if(existingRecords > 0) {
          await Database.table('admins')
            .where({email: user})
            .update({admin: 'true'})
        } else {
          await Database.table('admins')
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

    async removeAdmin({ response, params }) {
      const user = params.name
      try {
        await Database.table('admins')
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

      const schools = await Database
        .select('*')
        .from('ineko_schools')
        .leftJoin('ineko_total_ratings', 'ineko_total_ratings.school_id', 'ineko_schools.kod_kodsko')
      let admissions
      let regionMetrics
      if(queryParams.year == 'all') {
        admissions = await Database
          .select('*')
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
          .select('*')
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
      const years = []
      const admissions = await Admission.all()

      return response.send({ admissions, years })
    }

    async getAdmissionsBachelor ({ request, response }) {
      const queryParams = await request.all()

      let schools
      if(queryParams.year !== 'all') {
        schools = await Database.raw(
            `
              SELECT sch.nazov, sch.druh_skoly, sch.kod_kodsko, COUNT(adm.school_id) FROM ineko_schools AS sch
              JOIN ineko_total_ratings AS tr ON tr.school_id = sch.kod_kodsko
              WHERE adm."OBDOBIE" = ?
            `, [queryParams.year]
        )
      } else {
        schools = await Database.raw(
            `
              SELECT sch.nazov, sch.druh_skoly, sch.kod_kodsko, tr.celkove_hodnotenie FROM ineko_schools AS sch
              JOIN ineko_total_ratings AS tr ON tr.school_id = sch.kod_kodsko
            `
        )
      }

      console.log(schools)

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

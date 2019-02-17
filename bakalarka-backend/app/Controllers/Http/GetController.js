'use strict'

const Database = use('Database')
const Redis = use('Redis')

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

class GetController {
    async getImportedYears ({ response }) {
        // INEKO
        const AdditionalData = JSON.parse(await Redis.get('AdditionalData'))
        const TotalRating = JSON.parse(await Redis.get('TotalRating'))
        const Percentils = JSON.parse(await Redis.get('Percentils'))
        const Pointers = JSON.parse(await Redis.get('Pointers'))

        // AIS

        return response.send({
          'ineko': {
            TotalRating,
            Percentils,
            Pointers,
            AdditionalData
          },
          'ais': {

          }
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
          //admissions = await Admission.all()
        else
          admissions = await Database
            .select('*')
            .from('ais_admissions')
            .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
            .where('OBDOBIE', params.year)
          //admissions = await Database.table('ais_admissions').where('OBDOBIE', params.year)

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
    async getAdmissionsOverview ({ request, response, params }) {
      const queryParams = await request.all()

      const schools = await Database
        .select('*')
        .from('ineko_schools')
        .leftJoin('ineko_total_ratings', 'ineko_total_ratings.school_id', 'ineko_schools.kod_kodsko')
      let admissions
      if(queryParams.year == 'all')
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
      else
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
          .where('OBDOBIE', queryParams.year)

      return response.send({ schools, admissions })
    }
}

module.exports = GetController

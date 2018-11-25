'use strict'

const Student = use('App/Models/Student')
const Attendance = use('App/Models/Attendance')
const AttendanceType = use('App/Models/AttendanceType')
const StudyForm = use('App/Models/StudyForm')
const HighSchoolType = use('App/Models/HighSchoolType')
const Grade = use('App/Models/Grade')
const Subject = use('App/Models/Subject')
const School = use('App/Models/School')


class GetController {
    async getStudents ({ response }) {
        const students = await Student.all()

        return response.send(students)
    }

    async getAttendance ({ response }) {
        const attendance = await Attendance.all()

        return response.send(attendance)
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
}

module.exports = GetController

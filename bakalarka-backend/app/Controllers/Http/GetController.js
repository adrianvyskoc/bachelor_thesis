'use strict'

const Student = use('App/Models/Student')
const Attendance = use('App/Models/Attendance')
const AttendanceType = use('App/Models/AttendanceType')
const Grade = use('App/Models/Grade')


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

    async getAttendanceTypes ({ response }) {
        const attendanceTypes = await AttendanceType.all()

        return response.send(attendanceTypes)
    }
}

module.exports = GetController

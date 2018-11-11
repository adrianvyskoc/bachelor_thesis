'use strict'

const AttendanceType = use('App/Models/AttendanceType')

class SettingController {
    async createAttendanceType ({ request }) {
        const data = await request.all()

        console.log(data);

        const attendanceType = new AttendanceType()
        attendanceType.id = data.id
        attendanceType.name = data.name
        attendanceType.created_at = new Date()
        attendanceType.updated_at = new Date()

        try { await attendanceType.save() }
        catch(err) {
            console.log(err)
        }
    }
}

module.exports = SettingController

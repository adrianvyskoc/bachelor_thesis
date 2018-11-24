'use strict'

const HighSchoolType = use('App/Models/HighSchoolType')
const AttendanceType = use('App/Models/AttendanceType')
const StudyForm = use('App/Models/StudyForm')

class SettingController {
    async createCodebookRecord ({ request, params }) {
        const data = await request.all()

        var record 
        switch (params.type) {
            case 'attendanceTypes':
                record = new AttendanceType()
                break
        
            case 'studyForms':
                record  = new StudyForm()
                break

            case 'highSchoolTypes':
                record = new HighSchoolType()
                break

            default:
                break
        }

        record.id = data.id
        record.name = data.name
        record.created_at = new Date()
        record.updated_at = new Date()

        try { await record.save() }
        catch(err) {
            console.log(err)
        }
    }
}

module.exports = SettingController

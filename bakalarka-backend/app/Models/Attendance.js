'use strict'

const Model = use('Model')

class Attendance extends Model {
    static get table () {
        return 'ais_attendances'
    }
}

module.exports = Attendance

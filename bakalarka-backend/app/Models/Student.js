'use strict'

const Model = use('Model')

class Student extends Model {
    static get primaryKey () {
        return 'AIS_ID'
    }

    static get table () {
        return 'ais_students'
    }

    static get table1 () {
        return 'ais_admissions'
    }

}

module.exports = Student

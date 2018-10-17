'use strict'

const Model = use('Model')

class Student extends Model {
    static get primaryKey () {
        return 'AIS_ID'
    }
}

module.exports = Student

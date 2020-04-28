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


    static get table2 () {
        return 'diplomas'
    }

    static get table3 () {
        return 'list_diplomas'
    }
    

}

module.exports = Student

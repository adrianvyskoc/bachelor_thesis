'use strict'

const Model = use('Model')

class Admission extends Model {
    static get primaryKey () {
        return 'id'
    }

    static get table () {
        return 'ais_admissions'
    }

    school () {
        return this.hasOne('App/Models/School')
    }
}

module.exports = Admission

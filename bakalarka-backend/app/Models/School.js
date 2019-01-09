'use strict'

const Model = use('Model')

class School extends Model {
    static get primaryKey () {
        return 'kod_kodsko'
    }

    static get table () {
        return 'ineko_schools'
    } 

    admimssions () {
      return this.belongsToMany('App/Models/Admission')
    }
}

module.exports = School

'use strict'

const Model = use('Model')

class Admission extends Model {
    static get primaryKey () {
        return 'id'
    }
}

module.exports = Admission

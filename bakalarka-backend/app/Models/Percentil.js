'use strict'

const Model = use('Model')

class Percentil extends Model {
    static get primaryKey () {
        return 'ID'
    }

    static get table () {
        return 'ineko_percentils'
    }
}

module.exports = Percentil

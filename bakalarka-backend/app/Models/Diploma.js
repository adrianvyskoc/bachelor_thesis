'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Diploma extends Model {
    static get table () {
        return 'diplomas'
    }
}

module.exports = Diploma

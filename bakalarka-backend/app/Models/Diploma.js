'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Diploma extends Model {
    static get table () {
        return 'diplomas'
    }

    static get table () {
        return 'list_diplomas'
    }
}

module.exports = Diploma

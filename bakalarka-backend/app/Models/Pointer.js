'use strict'

const Model = use('Model')

class Pointer extends Model {
    static get primaryKey () {
        return 'ID'
    }

    static get table () {
        return 'ineko_individual_pointer_values'
    }
}

module.exports = Pointer

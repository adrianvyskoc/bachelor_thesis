'use strict'

const Model = use('Model')

class AdditionalData extends Model {
    static get primaryKey () {
        return 'ID'
    }

    static get table () {
        return 'ineko_additional_data'
    }
}

module.exports = AdditionalData

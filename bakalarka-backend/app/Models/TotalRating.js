'use strict'

const Model = use('Model')

class TotalRating extends Model {
    static get primaryKey () {
        return 'ID'
    }

    static get table () {
        return 'ineko_total_ratings'
    }
}

module.exports = TotalRating

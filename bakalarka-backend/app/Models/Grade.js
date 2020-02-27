'use strict'

const Model = use('Model')

class Grade extends Model {
  static get table () {
    return 'ais_grades'
  }
}

module.exports = Grade

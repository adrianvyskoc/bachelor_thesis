'use strict'

const Model = use('Model')

class Subject extends Model {

  static get table () {
      return 'ais_subjects'
  }

}

module.exports = Subject

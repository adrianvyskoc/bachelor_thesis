'use strict'

const Schema = use('Schema')

class StudyFormsSchema extends Schema {
  up () {
    this.create('study_forms', (table) => {
      table.increments()
      table.timestamps()
      table.string('name')
    })
  }

  down () {
    this.drop('study_forms')
  }
}

module.exports = StudyFormsSchema

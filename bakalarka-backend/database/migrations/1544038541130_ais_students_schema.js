'use strict'

const Schema = use('Schema')

class AisStudentsSchema extends Schema {
  up () {
    this.create('ais_students', (table) => {
      table.increments('AIS_ID')
      table.integer('SCHOOL_ID').references('kod_kodsko').inTable('ineko_schools')
      table.integer('STUDY_FORM_ID').references('id').inTable('study_forms')

      table.timestamps()
      table.string('MENO')
      table.string('PRIEZVISKO')
      table.string('STUDIUM')
      table.integer('ROCNIK')
    })
  }

  down () {
    this.drop('ais_students')
  }
}

module.exports = AisStudentsSchema

'use strict'

const Schema = use('Schema')

class GradesSchema extends Schema {
  up () {
    this.create('grades', (table) => {
      table.increments()
      table.timestamps()
      table.integer('AIS_ID')
      table.string('RCS')
      table.string('KOD')
      table.string('PREDMET')
      table.string('ZAP_VYSLEDOK')
      table.string('PREDMET_VYSLEDOK')
      table.integer('POCET_ZAPISOV')
      table.integer('KREDITY')
    })
  }

  down () {
    this.drop('grades')
  }
}

module.exports = GradesSchema

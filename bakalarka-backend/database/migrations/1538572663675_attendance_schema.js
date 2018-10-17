'use strict'

const Schema = use('Schema')

class AttendanceSchema extends Schema {
  up () {
    this.create('attendances', (table) => {
      table.increments()
      table.timestamps()
      table.string('OBDOBIE')
      table.string('KOD')
      table.string('PREDMET')
      table.integer('AIS_ID')
      table.string('ROZVRHOVA_AKCIA')
      table.integer('ROZVRHOVA_AKCIA_ID')
      table.integer('PORADI')
      table.integer('UCAST_ID')
      table.string('UCAST')
    })
  }

  down () {
    this.drop('attendances')
  }
}

module.exports = AttendanceSchema

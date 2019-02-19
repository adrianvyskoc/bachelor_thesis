'use strict'

const Schema = use('Schema')

class AisSubjectsSchema extends Schema {
  up () {
    this.create('ais_subjects', (table) => {
      table.increments()

      table.string("PREDMET")
      table.string("KOD")
      table.integer("KREDITY")
      table.string("UKONCENIE")
    })
  }

  down () {
    this.drop('ais_subjects')
  }
}

module.exports = AisSubjectsSchema

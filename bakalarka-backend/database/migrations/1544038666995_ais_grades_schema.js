'use strict'

const Schema = use('Schema')

class AisGradesSchema extends Schema {
  up () {
    this.create('ais_grades', (table) => {
      table.increments()
      table.integer("AIS_ID").references("AIS_ID").inTable("ais_students")
      table.integer("PREDMET_ID").references("id").inTable("ais_subjects")

      table.string("OBDOBIE")
      table.string("RCS")
      table.string("ZAP_VYSLEDOK")
      table.string("PREDMET_VYSLEDOK")
      table.integer("POCET_ZAPISOV")
    })
  }

  down () {
    this.drop('ais_grades')
  }
}

module.exports = AisGradesSchema

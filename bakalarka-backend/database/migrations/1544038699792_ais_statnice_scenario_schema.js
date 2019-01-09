'use strict'

const Schema = use('Schema')

class AisStatniceScenarioSchema extends Schema {
  up () {
    this.create('ais_statnice_scenarios', (table) => {
      table.increments()
      table.integer("STUDENT_ID").references("AIS_ID").inTable("ais_students")

      table.string("OBDOBIE")
    })
  }

  down () {
    this.drop('ais_statnice_scenarios')
  }
}

module.exports = AisStatniceScenarioSchema

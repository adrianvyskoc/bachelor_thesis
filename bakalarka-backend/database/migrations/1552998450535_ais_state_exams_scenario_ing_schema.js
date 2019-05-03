'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AisStateExamsScenarioIngSchema extends Schema {
  up () {
    this.create('ais_state_exams_scenario_ings', (table) => {
      table.increments()
      // table.timestamps()

      table.string("OBDOBIE")
      table.string("čas")
      table.string("študent")
      table.string("názov_diplomovej_práce")
      table.string("vedúci")
      table.string("oponent")
      table.string("študijný_program")
      table.string("Komisia")
      table.string("datum_šs")
      table.string("Predseda")
      table.string("tajomník")
    })
  }

  down () {
    this.drop('ais_state_exams_scenario_ings')
  }
}

module.exports = AisStateExamsScenarioIngSchema

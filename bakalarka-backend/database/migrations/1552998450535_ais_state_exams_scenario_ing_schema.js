'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AisStateExamsScenarioIngSchema extends Schema {
  up () {
    this.create('ais_state_exams_scenario_ings', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('ais_state_exams_scenario_ings')
  }
}

module.exports = AisStateExamsScenarioIngSchema

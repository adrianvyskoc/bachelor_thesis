'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AisStateExamsOverviewIngSchema extends Schema {
  up () {
    this.create('ais_state_exams_overview_ings', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('ais_state_exams_overview_ings')
  }
}

module.exports = AisStateExamsOverviewIngSchema

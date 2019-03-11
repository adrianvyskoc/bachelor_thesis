'use strict'

const Schema = use('Schema')

class StateExamsScenarioSchema extends Schema {
  up () {
    this.create('ais_state_exams_scenarios', (table) => {
      table.increments()

      table.string("OBDOBIE")
      table.string("Typ_proj")
      table.string("Štud_prog")
      table.string("Riešiteľ")
      table.string("Názov_projektu")
      table.string("Vedúci_projektu")
      table.string("Oponent")
      table.string("Vedúci")
      table.string("Oponent_1")
      table.string("Výsledné_hodnotenie")
      table.string("dňa")
      table.string("Komisia")
      table.string("Predseda")
      table.string("Tajomník")
    })
  }

  down () {
    this.drop('ais_state_exams_scenarios')
  }
}

module.exports = StateExamsScenarioSchema

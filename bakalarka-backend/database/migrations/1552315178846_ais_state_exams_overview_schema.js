'use strict'

const Schema = use('Schema')

class StateExamsOverviewSchema extends Schema {
  up () {
    this.create('ais_state_exams_overviews', (table) => {
      table.increments()

      table.string("OBDOBIE")
      table.string("Celé_meno_s_titulmi")
      table.integer("AIS_ID")
      table.string("Identifikácia_štúdia")
      table.string("Obhajoba")
      table.string("Záverečná_práca_názov")
      table.string("Vedúci")
      table.string("Oponent")
      table.string("Stav")
      table.decimal("VŠP_štúdium")
      table.decimal("VŠP_štud_bpo")
    })
  }

  down () {
    this.drop('ais_state_exams_overviews')
  }
}

module.exports = StateExamsOverviewSchema

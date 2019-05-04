'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StateExamsParamsIngSchema extends Schema {
  up () {
    this.create('state_exams_params_ings', (table) => {
      table.increments()
      table.timestamps()

      table.decimal("crVsp")
      table.string("crCelkovo")
      table.string("pldOponent")
      table.string("pldCelkovo")
      table.integer("pldNavrh")
      table.decimal("mclVsp")
      table.string("mclOponent")
      table.string("mclCelkovo")
      table.decimal("clVsp")
      table.string("clOponent")
      table.string("clCelkovo")
    })
  }

  down () {
    this.drop('state_exams_params_ings')
  }
}

module.exports = StateExamsParamsIngSchema

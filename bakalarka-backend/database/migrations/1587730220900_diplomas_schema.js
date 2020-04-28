'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DiplomasSchema extends Schema {
  up () {
    this.create('diplomas', (table) => {
      table.increments()
      table.timestamps()

      table.string("AIS_ID")
      table.string("rok_prijatia")
      table.string("studijny_program")
      table.string("type")
      table.string("diploma_title")
      table.string("round")
      table.string("position")
      table.integer("points")
    })
  }

  down () {
    this.drop('diplomas')
  }
}

module.exports = DiplomasSchema

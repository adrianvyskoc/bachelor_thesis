'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DiplomasSchema extends Schema {
  up () {
    this.create('diplomas', (table) => {
      table.increments()
      table.timestamps()

      table.integer("AIS_ID").references("AIS_ID").inTable("ais_students")
      table.string("diploma_title")
      table.string("position")
    })
  }

  down () {
    this.drop('diplomas')
  }
}

module.exports = DiplomasSchema

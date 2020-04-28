'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EntryTestsSchema extends Schema {
  up () {
    this.create('entry_tests', (table) => {
      table.increments()
      table.integer('id_student').references('AIS_ID').inTable('ais_students')
      table.string('OBDOBIE')
      table.decimal('body')
    })
  }

  down () {
    this.drop('entry_tests')
  }
}

module.exports = EntryTestsSchema

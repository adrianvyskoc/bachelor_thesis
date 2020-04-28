'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListDiplomasSchema extends Schema {
  up () {
    this.create('list_diplomas', (table) => {
      table.increments()
      table.timestamps()

      table.string("zameranie")
      table.string("nazov")
      table.string("kolo")
      table.string("umiestnenie")
      table.integer("body")
    })
  }

  down () {
    this.drop('list_diplomas')
  }
}

module.exports = ListDiplomasSchema




'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdminsSchema extends Schema {
  up () {
    this.create('admins', (table) => {
      table.increments()

      table.string("email").unique()
      table.boolean("admin").notNullable().defaultTo('false')
      table.boolean("access").notNullable().defaultTo('true')

      table.timestamps()
    })
  }

  down () {
    this.drop('admins')
  }
}

module.exports = AdminsSchema

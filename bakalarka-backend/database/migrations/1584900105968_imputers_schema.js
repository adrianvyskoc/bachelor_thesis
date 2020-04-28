'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImputersSchema extends Schema {
  up () {
    this.create('imputers', (table) => {
      table.increments('id')
      table.integer('id_model').references('id').inTable('prediction_models')
      table.string('column_name')
      table.binary('imputer')
      
    })
  }

  down () {
    this.drop('imputers')
  }
}

module.exports = ImputersSchema

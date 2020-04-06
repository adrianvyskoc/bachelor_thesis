'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PredictionModelsSchema extends Schema {
  up () {
    this.create('prediction_models', (table) => {
      table.increments('id')
      table.string("name")
      table.integer("subject_id").references("id").inTable('ais_subjects')
      table.string("type")
      table.string("used_years")
      table.string("used_tables")
      table.decimal("size_of_training_set")
      table.decimal("accuracy")
      table.decimal("f1")
      table.decimal("precision")
      table.decimal("recall")
      table.binary("model")
      table.binary("encoder")
    })
  }

  down () {
    this.drop('prediction_models')
  }
}

module.exports = PredictionModelsSchema

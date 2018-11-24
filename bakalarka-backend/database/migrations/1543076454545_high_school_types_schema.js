'use strict'

const Schema = use('Schema')

class HighSchoolTypesSchema extends Schema {
  up () {
    this.create('high_school_types', (table) => {
      table.increments()
      table.timestamps()
      table.string('name')
    })
  }

  down () {
    this.drop('high_school_types')
  }
}

module.exports = HighSchoolTypesSchema

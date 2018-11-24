'use strict'

const Schema = use('Schema')

class SubjectsSchema extends Schema {
  up () {
    this.create('subjects', (table) => {
      table.increments()
      table.timestamps()
      table.string('PREDMET')
      table.string('KOD')
      table.integer('KREDITY')
    })
  }

  down () {
    this.drop('subjects')
  }
}

module.exports = SubjectsSchema

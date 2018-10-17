'use strict'

const Schema = use('Schema')

class StudentSchema extends Schema {
  up () {
    this.create('students', (table) => {
      table.increments('AIS_ID')
      table.timestamps()
      table.string('MENO')
      table.string('PRIEZVISKO')
      table.string('STUDIUM')
      table.integer('ROCNIK')
    })
  }

  down () {
    this.drop('students')
  }
}

module.exports = StudentSchema

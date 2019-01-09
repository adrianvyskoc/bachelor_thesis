'use strict'

const Schema = use('Schema')

class AisStudentsHistorySchema extends Schema {
  up () {
    this.create('ais_students_histories', (table) => {
      table.increments()
      table.integer("STUDENT_ID").references("AIS_ID").inTable("ais_students")

      table.string("MENO")
      table.string("PRIEZVISKO")
      table.string("STUDIUM")
      table.integer("ROCNIK")
    })
  }

  down () {
    this.drop('ais_students_histories')
  }
}

module.exports = AisStudentsHistorySchema

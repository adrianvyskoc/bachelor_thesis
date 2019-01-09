'use strict'

const Schema = use('Schema')

class AttendanceTypesSchema extends Schema {
  up () {
    this.create('attendance_types', (table) => {
      table.increments()

      table.string('name')
    })
  }

  down () {
    this.drop('attendance_types')
  }
}

module.exports = AttendanceTypesSchema

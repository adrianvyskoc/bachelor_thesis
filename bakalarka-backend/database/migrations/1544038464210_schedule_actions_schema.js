'use strict'

const Schema = use('Schema')

class ScheduleActionsSchema extends Schema {
  up () {
    this.create('schedule_actions', (table) => {
      table.increments()
      
      table.string('name')
    })
  }

  down () {
    this.drop('schedule_actions')
  }
}

module.exports = ScheduleActionsSchema

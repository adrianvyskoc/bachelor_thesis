'use strict'

const Schema = use('Schema')

class AisAttendancesSchema extends Schema {
  up () {
    this.create('ais_attendances', (table) => {
      table.increments()
      table.integer("AIS_ID").references("AIS_ID").inTable("ais_students")        
      table.integer("ROZVRHOVA_AKCIA_ID").references("id").inTable("schedule_actions")   
      table.integer("UCAST_ID").references("id").inTable("attendance_types")   
      table.integer("PREDMET_ID").references("id").inTable("ais_subjects")   

      table.string("OBDOBIE")
      table.string("KOD")
      table.integer("PORADI")
    })
  }

  down () {
    this.drop('ais_attendances')
  }
}

module.exports = AisAttendancesSchema

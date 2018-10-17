'use strict'

const Schema = use('Schema')

class SchoolSchema extends Schema {
  up () {
    this.create('schools', (table) => {
      table.increments()
      table.timestamps()
      table.string('ID')
      table.string('okres')
      table.string('kraj')
      table.string('zriadovatel')
      table.string('druh_skoly')
      table.string('jazyk')
      table.string('typ_skoly')
      table.string('nazov')
      table.string('ulica')
      table.string('obec')
      table.string('PSC')
      table.string('sur_x')
      table.string('sur_y')
      table.string('tel_predvobla')
      table.string('tel_cislo')
      table.string('tel_cislo2')
      table.string('tel_cislo3')
      table.string('fax_cislo')
      table.string('email')
      table.string('email2')
      table.string('email3')
      table.string('adresa_www')
      table.string('kod_kodsko')
      table.string('postih')
      table.string('postih1_nazov')
      table.string('postih2_nazov')
      table.string('postih3_nazov')
      table.string('postih4_nazov')
    })
  }

  down () {
    this.drop('schools')
  }
}

module.exports = SchoolSchema

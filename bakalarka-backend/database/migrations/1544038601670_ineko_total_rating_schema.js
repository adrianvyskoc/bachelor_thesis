'use strict'

const Schema = use('Schema')

class InekoTotalRatingSchema extends Schema {
  up () {
    this.create('ineko_total_ratings', (table) => {
      table.increments('ID')
			table.integer("school_id").references('kod_kodsko').inTable('ineko_schools')

			table.timestamps()
			table.string("typ")
			table.string("OBDOBIE")
			table.decimal("celkove_hodnotenie")
			table.decimal("maturity")
			table.decimal("testovanie9")
			table.decimal("matematika")
			table.decimal("vyucovaci_jazyk")
			table.decimal("cudzie_jazyky")
			table.decimal("mimoriadne_vysledky")
			table.decimal("nezamestnanost_absolventov")
			table.decimal("vysledky_inspekcie")
			table.decimal("ucasti_na_sutaziach")
			table.decimal("prijimanie_na_VS")
			table.decimal("pedagogicky_zbor")
			table.decimal("financne_zdroje")
    })
  }

  down () {
    this.drop('ineko_total_ratings')
  }
}

module.exports = InekoTotalRatingSchema

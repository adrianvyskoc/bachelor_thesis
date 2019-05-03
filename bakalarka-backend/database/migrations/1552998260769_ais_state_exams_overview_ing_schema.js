'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AisStateExamsOverviewIngSchema extends Schema {
  up () {
    this.create('ais_state_exams_overview_ings', (table) => {
      table.increments()
      // table.timestamps()

      table.string("OBDOBIE")
      table.string("Celé_meno_s_titulmi")
      table.integer("AIS_ID").references("AIS_ID").inTable("ais_students")
      table.string("Identifikácia_štúdia")
      table.string("Obhajoba")
      table.string("Záverečná_práca_názov")
      table.string("Vedúci")
      table.string("Oponent")
      table.string("Stav")
      table.decimal("VŠP_štúdium")
      table.decimal("VŠP_štud_bpo")

       // ----------- doplnene stlpce ------------
       table.string("uzavreteStudium")
       // hlavička: Obhajoba hodnotenie
       table.string("oponentHodnotenie")
       table.string("vysledneHodnotenie")
       // hlavička: Ďalšie informácie
       table.string("hlasi_sa_na_phd")
       table.string("dp3_v_aj")
       table.string("ssOpravnyTermin")
       // Návrh - cena akákoľvek (vyhodnotí sa samé)
       // hlavička: Návrh na ocenenie z komisie za prácu
       table.string("navrhPoradie")
       table.string("clanokIny")
       table.string("clanokIITSRC")
       // Automaticky navrh (vyhodnoti sa same)
       table.string("navrhDoRSP1")
       table.string("konecneRozhodnutie1")
       // hlavička: Ocenenie za prospech
       // Automaticky navrh (vyhodnoti sa same)
       table.string("navrhDoRSP2")
       table.string("konecneRozhodnutie2")
       // hlavička: Sutaze
       table.string("konecneRozhodnutie3")
       table.string("potvrdenieIET")
       table.string("poznamky")
    })
  }

  down () {
    this.drop('ais_state_exams_overview_ings')
  }
}

module.exports = AisStateExamsOverviewIngSchema

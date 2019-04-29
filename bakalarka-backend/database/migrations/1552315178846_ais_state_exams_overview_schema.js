'use strict'

const Schema = use('Schema')

class StateExamsOverviewSchema extends Schema {
  up () {
    this.create('ais_state_exams_overviews', (table) => {
      table.increments()

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
      // hlavička: Ďalšie informácie
      table.string("bp2_v_aj")
      table.string("ssOpravnyTermin")
      // Návrh - cena akákoľvek (vyhodnotí sa samé)
      // hlavička: Návrh na ocenenie z komisie za prácu
      table.string("navrhVKomisiiPoradie")
      table.string("skorTeoreticka")
      table.string("skorPrakticka")
      // Automaticky navrh (vyhodnoti sa same)
      table.string("navrhDoRSP1")
      table.string("konecneRozhodnutie1")
      // hlavička: Ocenenie za prospech
      // Automaticky navrh (vyhodnoti sa same)
      table.string("navrhDoRSP2")
      table.string("konecneRozhodnutie2")
      table.string("promocie")
      table.string("najhorsiaZnamka")
    })
  }

  down () {
    this.drop('ais_state_exams_overviews')
  }
}

module.exports = StateExamsOverviewSchema

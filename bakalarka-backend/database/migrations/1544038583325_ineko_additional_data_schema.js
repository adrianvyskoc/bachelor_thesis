'use strict'

const Schema = use('Schema')

class InekoAdditionalDataSchema extends Schema {
  up () {
    this.create('ineko_additional_data', (table) => {
      table.increments('ID')
			table.integer("school_id").references('kod_kodsko').inTable('ineko_schools')

			table.timestamps()
			table.string("typ")
			table.string("OBDOBIE")
			table.decimal("Mat_SJ")
			table.decimal("Mat_M")
			table.decimal("Mat_MJ")
			table.decimal("Mat_SJaSL")
			table.decimal("Mat_AJB1")
			table.decimal("Mat_AJB2")
			table.decimal("Mat_AJC1")
			table.decimal("Mat_NJB1")
			table.decimal("Mat_NJB2")
			table.decimal("Mat_NJC1")
			table.decimal("T9_SJ")
			table.decimal("T9_M")
			table.decimal("T9_MJ")
			table.decimal("T9_SJaSL")
			table.string("riad_skoly")
			table.string("podm_VaV")
			table.string("VV_proces")
			table.decimal("insp_9R_SJ")
			table.decimal("insp_4R_Pri")
			table.decimal("insp_9r_Fyz")
			table.decimal("insp_9R_Pri")
			table.decimal("ucasti")
			table.decimal("Kom_M")
			table.decimal("Kom_SJ")
			table.decimal("mimo_vysl")
			table.decimal("nezam ")
			table.decimal("nezam_okres")
			table.decimal("prijati_VS")
			table.decimal("uspesnost_VS")
			table.decimal("poc_ucitelov")
			table.decimal("IKT")
			table.decimal("kval")
			table.decimal("rozpocet")
			table.decimal("vlastne_zdroje")
    })
  }

  down () {
    this.drop('ineko_additional_data')
  }
}

module.exports = InekoAdditionalDataSchema
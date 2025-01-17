'use strict'

const Schema = use('Schema')

class AisAdmissionsSchema extends Schema {
  up () {
    this.create('ais_admissions', (table) => {
      table.increments()
      table.integer("AIS_ID").references("AIS_ID").inTable("ais_students")
      table.integer("school_id").references("kod_kodsko").inTable("ineko_schools")

      table.timestamps()
      table.string("stupen_studia")
      table.string("OBDOBIE")
      table.integer("Por")
      table.string("Priezvisko")
      table.string("Meno")
      table.string("Absolvovaná_VŠ")
      table.string("Abs_VŠ_program_odbor_text")
      table.string("Abs_VŠ_program_odbor")
      table.string("Abs_VŠ")
      table.string("Alt_pr_1")
      table.string("Alt_pr_2")
      table.string("Alternatívny_program_1")
      table.string("Alternatívny_program_2")
      table.decimal("Body_celkom")
      table.decimal("Body")
      table.string("Narodenie")
      table.string("Potvrdenie_záujmu")
      table.string("Prevedené")
      table.string("Prijaté")
      table.string("Maturita")
      table.string("E_mail")
      table.string("Et")
      table.string("Externá_výučbová_inštitúcia")
      table.string("Exb_celk")
      table.string("Fakulta")
      table.string("Forma")
      table.string("Forma_1")
      table.string("Kompl")
      table.string("Kontaktná_adresa")
      table.string("č_d")
      table.string("Kontaktná_adresa_obec")
      table.string("Kont_adresa_obec")
      table.string("Kont_adresa_okres")
      table.string("Kont_adr_pozn")
      table.string("PSČ")
      table.string("Kont_adresa_štát")
      table.string("Kont_adresa_ulica")
      table.string("Kont_adresa_ulica_1")
      table.string("Kontaktný_tel")
      table.string("Metóda")
      table.string("Miesto_narodenia")
      table.string("Miesto_výučby")
      table.string("Modifikácia_PK")
      table.string("Najvyššie_dosiahnuté_vzdelanie")
      table.string("Národnosť")
      table.string("Občianstvo")
      table.string("Odbor_na_SŠ")
      table.string("Odbor_SŠ")
      table.string("Odbor")
      table.string("Odkiaľ_sa_hlási")
      table.string("Odvolanie")
      table.string("Okres_narodenia")
      table.string("Používateľ_z_e_prihlášok")
      table.string("Pohlavie")
      table.string("Poznámka")
      table.string("Ústav")
      table.string("Štúdium")
      table.string("Priemer_SŠ")
      table.string("Priemer_SŠ_1")
      table.string("Priem_bc")
      table.string("Prijatie_na_program")
      table.string("Prijatie_na_program_1")
      table.string("Program")
      table.string("Program_1")
      table.string("Program_2")
      table.string("Reg_č")
      table.string("Stav")
      table.string("Rodné_číslo")
      table.integer("Maturita_1")
      table.string("Rozhodnutie_o_prijatí")
      table.integer("Rozh")
      table.string("Skoršie_štúdium")
      table.string("Skor_štúd_forma")
      table.string("Skor_štúd_ročník")
      table.string("Skor_štúd_rok")
      table.string("Stredná_škola")
      table.string("Stredná_škola_adresa")
      table.string("Stredná_škola_1")
      table.string("Stredná_škola_cudzinci")
      table.string("Súčasné_štúdium")
      table.string("Súčasné_štúdium_1")
      table.string("Súhlas_ZS")
      table.string("Študijný_odbor")
      table.string("Téma_záverečnej_práce")
      table.string("Téma_záverečnej_práce_v_AJ")
      table.string("Termín")
      table.string("Čas")
      table.string("Dátum")
      table.string("Miestnosť")
      table.string("Titul")
      table.string("Titul_za")
      table.string("Adresa_trvalého_pobytu")
      table.string("č_d_1")
      table.string("Trvalý_pobyt_obec")
      table.string("Trv_pobyt_obec")
      table.string("Trv_pobyt_okres")
      table.string("Trv_pobyt_pozn")
      table.string("PSČ_1")
      table.string("Trv_pobyt_štát")
      table.string("Trv_pobyt_ulica")
      table.string("Trv_pobyt_ulica_1")
      table.string("Školiteľ")
      table.string("Predmety")
      table.string("Zameranie")
      table.string("Zapl")
      table.string("Zvol_predmet")
      table.string("Zvol_predmet_1")

      table.decimal("Externá_maturita_z_cudzieho_jazyka_ECJ")
      table.decimal("Externá_maturita_z_matematiky_EM")
      table.decimal("Písomný_test_z_matematiky_SCIO_PTM")
      table.decimal("Všeobecné_študijné_predpoklady_SCIO_VŠP")
    })
  }

  down () {
    this.drop('ais_admissions')
  }
}

module.exports = AisAdmissionsSchema

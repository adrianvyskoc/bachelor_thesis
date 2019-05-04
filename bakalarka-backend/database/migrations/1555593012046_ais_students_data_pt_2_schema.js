'use strict'

const Schema = use('Schema')

class AisStudentsDataPt2Schema extends Schema {
  up () {
    this.create('ais_students_data_pt_2', (table) => {
      table.increments()
      table.timestamps()

      table.integer("ID").references("AIS_ID").inTable("ais_students")
      table.string("OBDOBIE")
      table.string("SEMESTER")
      table.string("Celé_meno_s_titulmi")
      table.string("Pohlavie")
      table.string("Poplatky_poznámka")
      table.string("Zapl_rozpočítané")
      table.string("Rozhodnutie")
      table.string("Zaplatené")
      table.string("Vypočítané")
      table.decimal("Percentil_ob_+_roč")
      table.decimal("Percentil_prog_+_roč")
      table.decimal("Priemer")
      table.string("Poznámka")
      table.string("Pracovisko")
      table.string("Pracovisko_1")
      table.string("Predchádzajúce_priezvisko")
      table.string("Predmety_vysvedčení")
      table.string("Predmety_vysvedčení_výsledky")
      table.string("Predmety_vysvedčení_výsledky_1")
      table.string("Predmety_ŠS_výsledky")
      table.string("Predmety_ŠS")
      table.string("Predmety_ŠS_výsledky_1")
      table.string("Predp_koniec")
      table.string("Študentský_domov_poznámka")
      table.string("Prehlásenie_o_spracovaní_OÚ")
      table.integer("Verzia_prehlásenia_o_spracovaní_OÚ")
      table.string("Dátum_súhlasu_so_spracovaním_OÚ")
      table.decimal("Priemer_SŠ")
      table.string("Program")
      table.string("Program_1")
      table.string("Program_2")
      table.string("Prvé_štúdium")
      table.string("Reg_p")
      table.integer("Roč")
      table.string("Rodné_číslo")
      table.string("Rodné_priezvisko")
      table.string("Rodný_kód")
      table.integer("Rok_maturity")
      table.integer("Rozhod")
      table.string("Stredná_škola")
      table.string("Školiteľ")
      table.string("Školiteľ_špecialista")
      table.string("Špec_potr_do")
      table.string("Špecifická_potreba")
      table.string("Špec_potr_od")
      table.string("Štát_narodenia")
      table.string("Štátne_občianstvo")
      table.string("Št_obč")
      table.string("Známka_ŠZS")
      table.string("Známka_ŠZS_1")
      table.integer("Sk")
      table.string("Študijný_odbor")
      table.string("Študijný_plán")
      table.string("Titul")
      table.string("Titul_1")
      table.string("Typ_ukončenia")
      table.string("Poplatok_VŠ")
      table.decimal("VŠP")
      table.decimal("VŠP_4")
      table.decimal("VŠP_2_obd")
      table.decimal("VŠP_2_obd_4")
      table.decimal("VŠP_ar")
      table.decimal("VŠP_ar_4")
      table.decimal("VŠP_štúdium")
      table.decimal("VŠP_štud_bpo")
      table.decimal("VŠP_štúdium_4")
      table.decimal("VSP_štud_4_bpo")
      table.decimal("VŠP_min_ar_4")
      table.decimal("VŠP_min_ar")
      table.decimal("VŠP_min_ar_4_1")
      table.decimal("VŠP_posl_obd")
      table.decimal("VŠP_posl_obd_4")
      table.decimal("VŠP_posl_obd_4_1")
      table.string("Predmety_PZ")
      table.string("Druh_dohody")
      table.string("Dokedy")
      table.string("Stav")
      table.string("Špecifikácia")
      table.string("Miesto")
      table.string("Odkedy")
      table.string("Vyradenie")
      table.decimal("Architektúra_počítačov")
      table.decimal("Databázové_systémy")
      table.decimal("Externá_maturita_z_cudzieho_jazyka_ECJ")
      table.decimal("Externá_maturita_z_matematiky_EM")
      table.decimal("Externá_maturita_z_cudzieho_jazyka")
      table.decimal("Externá_maturita_z_matematiky")
      table.decimal("Písomný_test_z_matematiky_SCIO_PTM")
      table.decimal("Princípy_softvérového_inžinierstva")
      table.decimal("Programovanie_a_počítačové_systémy")
      table.decimal("Test_z_matematiky_SCIO_PTM")
      table.decimal("Test_z_matematiky_SCIO")
      table.decimal("Všeobecné_študijné_predpoklady_SCIO")
      table.decimal("Všeobecné_študijné_predpoklady_SCIO_VŠP")
      table.string("Fakulta")
      table.string("Program_3")
      table.string("Výmenný_program")
      table.string("Zameranie")
      table.string("Zaradenie_1")
      table.string("Študentské_domovy")
      table.string("Potvrdenie_odovzdania_ZP")
      table.string("Vloženie_ZP")
      table.string("Posl_zmena_ZP")
      table.string("Zadanie_ZP")
      table.string("Zadanie_ZP_1")
      table.string("ZP_druh")
      table.string("ZP_jazyk")
      table.string("ZP_kľúčové_slová_angl")
      table.string("ZP_kľúčové_slová_slovensky")
      table.string("Konzultant")
      table.string("Miesto_vypracovania")
      table.string("Záverečná_práca_názov_angl")
      table.string("Názov_ZP_v_angličtine")
      table.string("Záverečná_práca_názov")
      table.string("Názov_ZP")
      table.string("Odovzdanie_ZP")
      table.string("Odovzdanie_ZP_1")
      table.string("Oponent")
      table.decimal("Perc_zhody")
      table.string("ZP_odklad_zver")
      table.string("Pracovisko_číslo")
      table.string("Pracovisko_skratka")
      table.string("Stav_1")
      table.string("ZP_zver_autor")
      table.string("ZP_zver_štud_odd")
      table.string("Téma_záv_práce")
      table.string("Téma_záv_práce_pracovisko")
      table.string("Téma_záv_práce_návrh")
      table.string("Téma_záv_práce_pracovisko_1")
      table.string("Téma_záv_práce_vedúci")
      table.string("Vedúci")
      table.string("Vedúci_1")
    })
  }

  down () {
    this.drop('ais_students_data_pt_2')
  }
}

module.exports = AisStudentsDataPt2Schema

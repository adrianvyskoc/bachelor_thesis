'use strict'

const Database = use('Database')

const Student = use('App/Models/Student')
const Attendance = use('App/Models/Attendance')
const Admission = use('App/Models/Admission')
const Grade = use('App/Models/Grade')
const Subject = use('App/Models/Subject')
const School = use('App/Models/School')
const Admin = use('App/Models/Admin')

/**
 * Controller, ktorý slúži na sprostredkovávanie dát pre klientskú stranu.
 */
class GetController {

    /**
     * Endpoint, ktorý vráti používateľov, ktorí majú povolený prístup do systému
     */
    async getUsers({ response }) {
      try {
        const data = await Database
          .table('admins')
          .where({access: 'true'})
          .orderBy('id', 'desc')

          return response
          .status(200)
          .send(data)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý pridá nového používateľa do databázy, alebo len existujúcemu používateľovi povolí prístup
     */
    async addUser({ request, response}) {
      const user = request.body.name

      try {
        const existingRecords = await Admin
          .query()
          .where('email', user)
          .getCount()

        if(existingRecords > 0) {
          await Database
            .table('admins')
            .where({email: user})
            .update({access: 'true'})
        } else {
          await Database
            .table('admins')
            .insert({email: user, admin: 'false'})
        }
        return response
          .status(200)
          .send(true)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý pridá existujúcemu používateľovi admin práva, alebo vytvorí používateľa s admin právom
     */
    async addAdmin({ request, response }) {
      const user = request.body.name

      try {
        const existingRecords = await Admin
          .query()
          .where('email', user)
          .getCount()

        if(existingRecords > 0) {
          await Database
            .table('admins')
            .where({email: user})
            .update({admin: 'true'})
        } else {
          await Database
            .table('admins')
            .insert({email: user, admin: 'true'})
        }
        return response
          .status(200)
          .send(true)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý odstráni existujúcemu používateľovi admin práva
     */
    async removeAdmin({ request, response }) {
      const user = request.body.name
      try {
        await Database
          .table('admins')
          .where({email: user})
          .update({admin: 'false'})

        return response
          .status(200)
          .send(true)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý odstráni používateľovi povolený prístup do systému
     */
    async removeUser({ request, response}) {
      const user = request.body.name
      try {
        await Database
        .table('admins')
        .where({email: user})
        .update({access: 'false'})

        return response
          .status(200)
          .send(true)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    /** -----------------------------------------------------------------------
     * State Final Exams BC
     * ------------------------------------------------------------------------
     */
    /**
     * Endpoint, ktorý vráti všetky importované roky, ktoré používateľ zadal pri importovaní súborov z AIS-u pre štátne záverečné skúšky (ŠZS) vo web. aplikácii
     */
    async getDateYears({request, response}) {
      let rawData = [];
      const data = await Database.raw(`
        select distinct
          ais_state_exams_overviews."OBDOBIE"
        from
          ais_state_exams_overviews
        order by
          ais_state_exams_overviews."OBDOBIE" ASC
      `);

      // odstranenie nezelaneho tvaru ziskanych dat
      data.rows.map(e => {
        rawData.push(e['OBDOBIE']);
      })

      return response
        .status(200)
        .send(rawData)
    }

    /**
     * Endpoint, ktorý získa všetky potrebné dáta z importovaných súborov z AIS-u a z YonBan-u pre Vyhodnotenie štátnych skúšok bakalárskeho ročníka.
     * Dáta sú vrátené z vyžiadaného roku
     */
    async getStateFinalExamsBc ({ request, response }) {
      const datum = request.body.year;
      try {
        const data = await Database.raw(`
          select
            ais_state_exams_overviews.id as id,
            ais_state_exams_overviews."OBDOBIE" as "obdobie",
            ais_state_exams_overviews."Celé_meno_s_titulmi" as "celeMenoSTitulmi",
            ais_state_exams_overviews."AIS_ID" as "aisId",
            ais_state_exams_overviews."Identifikácia_štúdia" as "identifikaciaStudia",
            ais_state_exams_overviews."Obhajoba" as "obhajoba",
            ais_state_exams_overviews."Záverečná_práca_názov" as "zaverecnaPracaNazov",
            ais_state_exams_overviews."Vedúci" as "veduci",
            ais_state_exams_overviews."Oponent" as "oponent",
            ais_state_exams_overviews."Stav" as "stav",
            ais_state_exams_overviews."VŠP_štúdium" as "vspStudium",
            ais_state_exams_overviews."VŠP_štud_bpo" as "vspStudBpo",
            ais_state_exams_scenarios."Štud_prog" as "studProg",
            ais_state_exams_scenarios."Riešiteľ" as "riesitel",
            ais_state_exams_scenarios."Vedúci_projektu" as "veduciY",
            ais_state_exams_scenarios."Vedúci" as "veduciHodnotenie",
            ais_state_exams_scenarios."Oponent_1" as "oponentHodnotenie",
            ais_state_exams_scenarios."Výsledné_hodnotenie" as "vysledneHodnotenie",
            ais_state_exams_scenarios."dňa" as "dna",
            ais_state_exams_scenarios."Komisia" as "komisia",
            ais_state_exams_scenarios."Predseda" as "predseda",
            ais_state_exams_scenarios."Tajomník" as "tajomnik",
            ais_state_exams_overviews."uzavreteStudium",
            ais_state_exams_overviews."bp2_v_aj",
            ais_state_exams_overviews."ssOpravnyTermin",
            ais_state_exams_overviews."navrhVKomisiiPoradie",
            ais_state_exams_overviews."skorTeoreticka",
            ais_state_exams_overviews."skorPrakticka",
            ais_state_exams_overviews."navrhDoRSP1",
            ais_state_exams_overviews."konecneRozhodnutie1",
            ais_state_exams_overviews."navrhDoRSP2",
            ais_state_exams_overviews."konecneRozhodnutie2",
            ais_state_exams_overviews."promocie",
            ais_state_exams_overviews."najhorsiaZnamka",
            ais_state_exams_overviews."poznamky"
          from
            ais_state_exams_overviews
          full outer join
            ais_state_exams_scenarios
          on
            REGEXP_REPLACE(lower(ais_state_exams_overviews."Záverečná_práca_názov"), '[ \\s]*', '', 'g') = REGEXP_REPLACE(lower(ais_state_exams_scenarios."Názov_projektu"), '[ \\s]*', '', 'g')
          and
            ais_state_exams_overviews."Celé_meno_s_titulmi" like '%' || ais_state_exams_scenarios."Riešiteľ" || '%'
          and
            ais_state_exams_overviews."OBDOBIE" like ais_state_exams_scenarios."OBDOBIE"
          where
            ais_state_exams_overviews."OBDOBIE" = '${datum}'
          order by id ASC
        `);

        console.log('dlzka dat', data.rows.length);

        return response
          .status(200)
          .send(data.rows)

      } catch(e) {
        console.log('error', e);
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý uloží všetky údaje o ŠZS BC, ktoré sa dopĺňajú na stránke do tabuľky ručne
     */
    async updateStateFinalExamsBc ({ response, request }) {
      const data = request.body
      try{
        await Database
          .table('ais_state_exams_overviews')
          .where({id: data.id})
          // nazovTabulky: data.nazovParametruCoPosielamzFE
          .update({
            uzavreteStudium: data.uzavreteStudium,
            bp2_v_aj: data.bp2_v_aj,
            ssOpravnyTermin: data.ssOpravnyTermin,
            navrhVKomisiiPoradie: data.navrhVKomisiiPoradie,
            skorTeoreticka: data.skorTeoreticka,
            skorPrakticka: data.skorPrakticka,
            navrhDoRSP1: data.navrhDoRSP1,
            konecneRozhodnutie1: data.konecneRozhodnutie1,
            navrhDoRSP2: data.navrhDoRSP2,
            konecneRozhodnutie2: data.konecneRozhodnutie2,
            promocie: data.promocie,
            najhorsiaZnamka: data.najhorsiaZnamka,
            poznamky: data.poznamky,
          })

        console.log(request.body)

        return response
          .status(200)
          .send(true)

      } catch(e) {
        console.log(e)
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý vymaže všetky importované údaje pre ŠZS BC vybraného roku
     */
    async deleteStateFinalExamsBc ({ request, response }) {
      const datum = request.body.year;

      try{
        await Database
        .query()
        .table('ais_state_exams_overviews')
        .where('OBDOBIE', datum)
        .delete()

        await Database
        .query()
        .table('ais_state_exams_scenarios')
        .where('OBDOBIE', datum)
        .delete()

        return response
          .status(200)
          .send(true)

      } catch(e) {
        console.log('error', e);
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Final Exam Params Configuration for BC
     */
    /**
     * Endpoint, ktorý získa všetky parametre na vyhodnotenie ocenení pre ŠZS BC
     * Ak v databáze žiadne nie sú, vložia sa prednastavené hodnoty aktuálne pre rok 2018/19
     */
    async getFinalExamConfiguration ({ response }) {
      const data = await Database
        .table('state_exams_params')

        if (data[0] == undefined) {
          console.log(data[0])

          await Database.raw(`
            ALTER SEQUENCE
              state_exams_params_id_seq
            RESTART WITH 1
          `)

          await Database
            .table('state_exams_params')
            .insert([{
              crVsp: 1.2,
              crCelkovo: 'A',
              pldVeduci: 'B',
              pldOponent: 'B',
              pldCelkovo: 'B',
              pldNavrh: 1,
              mclVsp: 1.19,
              mclVeduci: 'A',
              mclOponent: 'D',
              mclCelkovo: 'A',
              clVsp: 1.6,
              clVeduci: 'C',
              clOponent: 'D',
              clCelkovo: 'B'
            }])

          const dataNew = await Database
            .table('state_exams_params')

          return response
            .status(200)
            .send(dataNew[0]);
        }

      return response
        .status(200)
        .send(data[0]);
    }

    /**
     * Endpoint, ktorý aktualizuje zmeny vykonané vo web. aplikácii pri zmene parametrov na vyhodnotenie ocenení
     */
    async updateFinalExamConfiguration ({ response, request }) {
      const data = request.body;
      try {
        await Database
          .table('state_exams_params')
          .where({ id: data.id })
          .update({
            crVsp: data.crVsp,
            crCelkovo: data.crCelkovo,
            pldVeduci: data.pldVeduci,
            pldOponent: data.pldOponent,
            pldCelkovo: data.pldCelkovo,
            pldNavrh: data.pldNavrh,
            mclVsp: data.mclVsp,
            mclVeduci: data.mclVeduci,
            mclOponent: data.mclOponent,
            mclCelkovo: data.mclCelkovo,
            clVsp: data.clVsp,
            clVeduci: data.clVeduci,
            clOponent: data.clOponent,
            clCelkovo: data.clCelkovo
          })

        return response
          .status(200)
          .send(true);

      } catch(e) {
        console.log(e)

        return response
          .status(500)
          .send(e)
      }
    }

    /** -----------------------------------------------------------------------
     * State Final Exams ING
     * ------------------------------------------------------------------------
     */
    /**
     * Endpoint, ktorý vráti všetky importované roky, ktoré používateľ zadal pri importovaní súborov z AIS-u pre štátne záverečné skúšky (ŠZS) vo web. aplikácii
     * pre ing
     */
    async getDateYearsIng({request, response}) {
      let rawData = [];
      const data = await Database.raw(`
        select distinct
          ais_state_exams_overview_ings."OBDOBIE"
        from
          ais_state_exams_overview_ings
        order by
          ais_state_exams_overview_ings."OBDOBIE" ASC
      `);

      // odstranenie nezelaneho tvaru ziskanych dat
      data.rows.map(e => {
        rawData.push(e['OBDOBIE']);
      })

      return response
        .status(200)
        .send(rawData)
    }

    /**
     * Endpoint, ktorý získa všetky potrebné dáta z importovaných súborov z AIS-u a z YonBan-u pre Vyhodnotenie štátnych skúšok inžinierskeho ročníka.
     * Dáta sú vrátené z vyžiadaného roku
     */
    async getStateFinalExamsIng ({ request, response }) {
      const datum = request.body.year;
      try {
        const data = await Database.raw(`
          select
            ais_state_exams_overview_ings.id as id,
            ais_state_exams_overview_ings."OBDOBIE" as "obdobie",
            ais_state_exams_overview_ings."Celé_meno_s_titulmi" as "celeMenoSTitulmi",
            ais_state_exams_overview_ings."AIS_ID" as "aisId",
            ais_state_exams_overview_ings."Identifikácia_štúdia" as "identifikaciaStudia",
            ais_state_exams_overview_ings."Obhajoba" as "obhajoba",
            ais_state_exams_overview_ings."Záverečná_práca_názov" as "zaverecnaPracaNazov",
            ais_state_exams_overview_ings."Vedúci" as "veduci",
            ais_state_exams_overview_ings."Oponent" as "oponent",
            ais_state_exams_overview_ings."Stav" as "stav",
            ais_state_exams_overview_ings."VŠP_štúdium" as "vspStudium",
            ais_state_exams_overview_ings."VŠP_štud_bpo" as "vspStudBpo",

            ais_state_exams_scenario_ings."študent" as "student",
            ais_state_exams_scenario_ings."názov_diplomovej_práce" as "nazovDiplomPrace",
            ais_state_exams_scenario_ings."vedúci" as "veduciY",
            ais_state_exams_scenario_ings."oponent" as "oponentY",
            ais_state_exams_scenario_ings."študijný_program" as "studProg",
            ais_state_exams_scenario_ings."Komisia" as "komisia",
            ais_state_exams_scenario_ings."datum_šs" as "datum",
            ais_state_exams_scenario_ings."Predseda" as "predseda",
            ais_state_exams_scenario_ings."tajomník" as "tajomnik",

            ais_state_exams_overview_ings."uzavreteStudium",
            ais_state_exams_overview_ings."oponentHodnotenie",
            ais_state_exams_overview_ings."vysledneHodnotenie",
            ais_state_exams_overview_ings."hlasi_sa_na_phd",
            ais_state_exams_overview_ings."dp3_v_aj",
            ais_state_exams_overview_ings."ssOpravnyTermin",
            ais_state_exams_overview_ings."navrhPoradie",
            ais_state_exams_overview_ings."clanokIny",
            ais_state_exams_overview_ings."clanokIITSRC",
            ais_state_exams_overview_ings."navrhDoRSP1",
            ais_state_exams_overview_ings."konecneRozhodnutie1",
            ais_state_exams_overview_ings."navrhDoRSP2",
            ais_state_exams_overview_ings."konecneRozhodnutie2",
            ais_state_exams_overview_ings."konecneRozhodnutie3",
            ais_state_exams_overview_ings."potvrdenieIET",
            ais_state_exams_overview_ings."poznamky"
          from
            ais_state_exams_overview_ings
          full outer join
            ais_state_exams_scenario_ings
          on
            REGEXP_REPLACE(lower(ais_state_exams_overview_ings."Záverečná_práca_názov"), '[ \\s]*', '', 'g') = REGEXP_REPLACE(lower(ais_state_exams_scenario_ings."názov_diplomovej_práce"), '[ \\s]*', '', 'g')
          and
            ais_state_exams_overview_ings."Celé_meno_s_titulmi" like '%' || ais_state_exams_scenario_ings."študent" || '%'
          and
            ais_state_exams_overview_ings."OBDOBIE" like ais_state_exams_scenario_ings."OBDOBIE"
          where
            ais_state_exams_overview_ings."OBDOBIE" = '${datum}'
          order by id ASC
        `);

        console.log('dlzka dat', data.rows.length);

        return response
          .status(200)
          .send(data.rows)

      } catch(e) {
        console.log('error', e);
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý uloží všetky údaje o ŠZS ING, ktoré sa dopĺňajú na stránke do tabuľky ručne
     */
    async updateStateFinalExamsIng ({ response, request }) {
      const data = request.body
      try{
        await Database
          .table('ais_state_exams_overview_ings')
          .where({id: data.id})
          // nazovTabulky: data.nazovParametruCoPosielamzFE
          .update({
            uzavreteStudium: data.uzavreteStudium,
            oponentHodnotenie: data.oponentHodnotenie,
            vysledneHodnotenie: data.vysledneHodnotenie,
            hlasi_sa_na_phd: data.hlasi_sa_na_phd,
            dp3_v_aj: data.dp3_v_aj,
            ssOpravnyTermin: data.ssOpravnyTermin,
            navrhPoradie: data.navrhPoradie,
            clanokIny: data.clanokIny,
            clanokIITSRC: data.clanokIITSRC,
            navrhDoRSP1: data.navrhDoRSP1,
            konecneRozhodnutie1: data.konecneRozhodnutie1,
            navrhDoRSP2: data.navrhDoRSP2,
            konecneRozhodnutie2: data.konecneRozhodnutie2,
            konecneRozhodnutie3: data.konecneRozhodnutie3,
            potvrdenieIET: data.potvrdenieIET,
            poznamky: data.poznamky,
          })

        console.log(request.body)

        return response
          .status(200)
          .send(true)

      } catch(e) {
        console.log(e)
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý vymaže všetky importované údaje pre ŠZS ING vybraného roku
     */
    async deleteStateFinalExamsIng ({ request, response }) {
      const datum = request.body.year;

      try{
        await Database
        .query()
        .table('ais_state_exams_overview_ings')
        .where('OBDOBIE', datum)
        .delete()

        await Database
        .query()
        .table('ais_state_exams_scenario_ings')
        .where('OBDOBIE', datum)
        .delete()

        return response
          .status(200)
          .send(true)

      } catch(e) {
        console.log('error', e);
        return response
          .status(500)
          .send(e)
      }
    }

     /**
     * Final Exam Params Configuration for ING
     */
    /**
     * Endpoint, ktorý získa všetky parametre na vyhodnotenie ocenení pre ŠZS ING
     * Ak v databáze žiadne nie sú, vložia sa prednastavené hodnoty aktuálne pre rok 2018/19
     */
    async getFinalExamConfigurationIng ({ response }) {
      const data = await Database
        .table('state_exams_params_ings')

        if (data[0] == undefined) {
          console.log(data[0])

          await Database.raw(`
            ALTER SEQUENCE
              state_exams_params_ings_id_seq
            RESTART WITH 1
          `)

          await Database
            .table('state_exams_params_ings')
            .insert([{
              crVsp: 1.2,
              crCelkovo: 'A',
              pldOponent: 'FX',
              pldCelkovo: 'A',
              pldNavrh: 2,
              mclVsp: 1.15,
              mclOponent: 'B',
              mclCelkovo: 'A',
              clVsp: 1.4,
              clOponent: 'FX',
              clCelkovo: 'FX'
            }])

          const dataNew = await Database
            .table('state_exams_params_ings')

          return response
            .status(200)
            .send(dataNew[0]);
        }

      return response
        .status(200)
        .send(data[0]);
    }

    /**
     * Endpoint, ktorý aktualizuje zmeny vykonané vo web. aplikácii pri zmene parametrov na vyhodnotenie ocenení pre ING
     */
    async updateFinalExamConfigurationIng ({ response, request }) {
      const data = request.body;
      try {
        await Database
          .table('state_exams_params_ings')
          .where({ id: data.id })
          .update({
            crVsp: data.crVsp,
            crCelkovo: data.crCelkovo,
            pldOponent: data.pldOponent,
            pldCelkovo: data.pldCelkovo,
            pldNavrh: data.pldNavrh,
            mclVsp: data.mclVsp,
            mclOponent: data.mclOponent,
            mclCelkovo: data.mclCelkovo,
            clVsp: data.clVsp,
            clOponent: data.clOponent,
            clCelkovo: data.clCelkovo
          })

        return response
          .status(200)
          .send(true);

      } catch(e) {
        console.log(e)

        return response
          .status(500)
          .send(e)
      }
    }

    /** -----------------------------------------------------------------------
     * Statistics
     * ------------------------------------------------------------------------
     */
    /**
     * Endpoint, ktorý vráti pre zvolený rok a nasledujúce sledované roky všetký údaje o študentoch, ktorí majú rovnaký rok nástupu
     */
    async getStatistics ({ request, response }) {
      let rokNastupu = request.body.rokNastup;
      let rokObdobia = request.body.rokObdobia;
      const duration = request.body.duration;

      let statObj = {};

      try {
        const data = await Database.raw(`
          select
            ais_students_data_pt_1.id as id,
            ais_students_data_pt_1."OBDOBIE" as "obdobie",
            ais_students_data_pt_1."SEMESTER" as "semester",
            ais_students_data_pt_1."ID" as "aisId",
            ais_students_data_pt_1."Celé_meno_s_titulmi" as "celeMenoSTitulmi",
            ais_students_data_pt_1."Rok_abs_VŠ" as "rokAbsVs",
            ais_students_data_pt_1."Štát" as "stat",
            ais_students_data_pt_1."Dĺžka_prerušenia_mes" as "dlzkaPrerusMesiac",
            ais_students_data_pt_1."Dátum_prerušenia" as "datumPrerusenia",
            ais_students_data_pt_1."Dátum_splnenia" as "datumSplnenia",
            ais_students_data_pt_1."Roky" as "roky",
            ais_students_data_pt_1."Kód_fin" as "kodFinancovania",
            ais_students_data_pt_1."Identifikácia_štúdia" as "identifikStud",
            ais_students_data_pt_1."Nástup" as "nastup",
            ais_students_data_pt_1."Obhajoba_1" as "obhajoba",
            ais_students_data_pt_2."OBDOBIE" as "obdobie2",
            ais_students_data_pt_2."SEMESTER" as "semester2",
            ais_students_data_pt_2."ID" as "aisId2",
            ais_students_data_pt_2."Celé_meno_s_titulmi" as "celeMenoSTitulmi2",
            ais_students_data_pt_2."Pohlavie" as "pohlavie",
            ais_students_data_pt_2."Predmety_vysvedčení_výsledky" as "predmetyVysvedVysledky",
            ais_students_data_pt_2."Program_2" as "studProg",
            ais_students_data_pt_2."Prvé_štúdium" as "prveStudium",
            ais_students_data_pt_2."Roč" as "rocnik",
            ais_students_data_pt_2."Známka_ŠZS" as "znamkaSZS",
            ais_students_data_pt_2."Študijný_plán" as "studPlan",
            ais_students_data_pt_2."Titul" as "titul",
            ais_students_data_pt_2."Typ_ukončenia" as "typUkoncenia",
            ais_students_data_pt_2."Vyradenie" as "vyradenieDatum",
            ais_students_data_pt_2."ZP_druh" as "druhZaverecnejPrace"
          from
            ais_students_data_pt_1
          left join
            ais_students_data_pt_2
          on
            ais_students_data_pt_1."Celé_meno_s_titulmi" like '%' || ais_students_data_pt_2."Celé_meno_s_titulmi" || '%'
          and
            ais_students_data_pt_1."OBDOBIE" like ais_students_data_pt_2."OBDOBIE"
          where
            ais_students_data_pt_1."rokNastupu" = '${rokNastupu}'
          and
            ais_students_data_pt_1."OBDOBIE" = '${rokObdobia}'
          and
            ais_students_data_pt_1."SEMESTER" = 'winter'
          order by id ASC
        `);

        statObj[rokObdobia] = {winter: null, summer: null};
        statObj[rokObdobia].winter = data.rows;
        let actIds = this.getIds(data.rows);

        statObj[rokObdobia].summer =  await this.getNextYearStatistics(actIds, rokNastupu, rokObdobia, 'summer');

        for (let i = 1; i < duration; i++) {
          rokObdobia++;
          let winterResult = await this.getNextYearStatistics(actIds, rokNastupu, rokObdobia, 'winter');
          let summerResult = await this.getNextYearStatistics(actIds, rokNastupu, rokObdobia, 'summer');
          statObj[rokObdobia] = {winter: null, summer: null};
          // statObj[rokObdobia]['winter'] = [];
          // statObj[rokObdobia]['summer'] = [];
          statObj[rokObdobia].winter = winterResult;
          statObj[rokObdobia].summer = summerResult;
        }
        return response
          .status(200)
          .send(statObj)
      } catch(e) {
        console.log('error', e);
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Vráti AIS ID študentov s rovnakým rokom nástupu, ktorých sme získali v prvom zvolenom roku
     * @param {*} arr Pole výsledkov získaných zo štatistickej tabuľky podľa vybraného roka
     */
    getIds(arr) {
      let ids = [];
      arr.forEach(e => {
        ids.push(e.aisId);
      });
      return ids;
    }

    /**
     * Získanie údajov o študentoch z prvého roku nástupu z nasledujúcich rokov
     * @param {*} actIds pole s aktuálnymi ID študentmi
     * @param {*} rokNastupu rok nástupu študentov na štúdium
     * @param {*} rokObdobia aktuálny rok štatistiky
     */
    async getNextYearStatistics(actIds, rokNastupu, rokObdobia, semeter) {
      const queryIds = `(${actIds})`;
      let result = [];

      try {
        result = await Database.raw(`
          select
            ais_students_data_pt_1.id as id,
            ais_students_data_pt_1."OBDOBIE" as "obdobie",
            ais_students_data_pt_1."SEMESTER" as "semester",
            ais_students_data_pt_1."ID" as "aisId",
            ais_students_data_pt_1."Celé_meno_s_titulmi" as "celeMenoSTitulmi",
            ais_students_data_pt_1."Rok_abs_VŠ" as "rokAbsVs",
            ais_students_data_pt_1."Štát" as "stat",
            ais_students_data_pt_1."Dĺžka_prerušenia_mes" as "dlzkaPrerusMesiac",
            ais_students_data_pt_1."Dátum_prerušenia" as "datumPrerusenia",
            ais_students_data_pt_1."Dátum_splnenia" as "datumSplnenia",
            ais_students_data_pt_1."Roky" as "roky",
            ais_students_data_pt_1."Kód_fin" as "kodFinancovania",
            ais_students_data_pt_1."Identifikácia_štúdia" as "identifikStud",
            ais_students_data_pt_1."Nástup" as "nastup",
            ais_students_data_pt_1."Obhajoba_1" as "obhajoba",
            ais_students_data_pt_2."OBDOBIE" as "obdobie2",
            ais_students_data_pt_2."SEMESTER" as "semester2",
            ais_students_data_pt_2."ID" as "aisId2",
            ais_students_data_pt_2."Celé_meno_s_titulmi" as "celeMenoSTitulmi2",
            ais_students_data_pt_2."Pohlavie" as "pohlavie",
            ais_students_data_pt_2."Predmety_vysvedčení_výsledky" as "predmetyVysvedVysledky",
            ais_students_data_pt_2."Program_2" as "studProg",
            ais_students_data_pt_2."Prvé_štúdium" as "prveStudium",
            ais_students_data_pt_2."Roč" as "rocnik",
            ais_students_data_pt_2."Známka_ŠZS" as "znamkaSZS",
            ais_students_data_pt_2."Študijný_plán" as "studPlan",
            ais_students_data_pt_2."Titul" as "titul",
            ais_students_data_pt_2."Typ_ukončenia" as "typUkoncenia",
            ais_students_data_pt_2."Vyradenie" as "vyradenieDatum",
            ais_students_data_pt_2."ZP_druh" as "druhZaverecnejPrace"
          from
            ais_students_data_pt_1
          left join
            ais_students_data_pt_2
          on
            ais_students_data_pt_1."Celé_meno_s_titulmi" like '%' || ais_students_data_pt_2."Celé_meno_s_titulmi" || '%'
          and
            ais_students_data_pt_1."OBDOBIE" like ais_students_data_pt_2."OBDOBIE"
          where
            ais_students_data_pt_1."rokNastupu" = '${rokNastupu}'
          and
            ais_students_data_pt_1."OBDOBIE" = '${rokObdobia}'
          and
            ais_students_data_pt_1."ID" in ${queryIds}
          and
            ais_students_data_pt_1."SEMESTER" = '${semeter}'
          order by id ASC
        `);

        return result.rows;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    /**
     * Endpoint, ktorý vráti všetky roky nástupu z importovaných súborov o údajoch študentov časť 1, LS a ZS
    */
    async getDateYearsStart({request, response}) {
      let rawData = [];
      const data = await Database.raw(`
        select distinct
          ais_students_data_pt_1."rokNastupu"
        from
          ais_students_data_pt_1
        order by
          ais_students_data_pt_1."rokNastupu" ASC
      `);

      // odstranenie nezelaneho tvaru ziskanych dat
      data.rows.map(e => {
        rawData.push(e['rokNastupu']);
      })

      return response
        .status(200)
        .send(rawData)
    }

    /**
     * Endpoint, ktorý vymaže všetky údaje o študentoch zo zvoleného roku
    */
    async deleteStatistics({request, response}) {
      const datum = request.body.year;

      try{
        await Database
        .query()
        .table('ais_students_data_pt_1')
        .where('OBDOBIE', datum)
        .delete()

        await Database
        .query()
        .table('ais_students_data_pt_2')
        .where('OBDOBIE', datum)
        .delete()

        return response
          .status(200)
          .send(true)

      } catch(e) {
        console.log('error', e);
        return response
          .status(500)
          .send(e)
      }
    }

    /**
     * Endpoint, ktorý vráti všetky roky z importovaných súborov o údajoch študentov časť 1, LS a ZS
    */
    async getDateYearsForDelete({request, response}) {
      let rawData = [];
      const data = await Database.raw(`
        select distinct
          ais_students_data_pt_1."OBDOBIE"
        from
          ais_students_data_pt_1
        order by
          ais_students_data_pt_1."OBDOBIE" ASC
      `);

      // odstranenie nezelaneho tvaru ziskanych dat
      data.rows.map(e => {
        rawData.push(e['OBDOBIE']);
      })

      return response
        .status(200)
        .send(rawData)
    }

    // ---

    async getGrades ({ response }) {
        const grades = await Grade.all()

        return response.send(grades)
    }

    async getSubjects({ response }) {
        const subjects = await Subject.all()

        return response.send(subjects)
    }

    /**
     * Endpoint, ktorý vráti dáta o všetkých školách, ktoré sú naimportované v systéme
     */
    async getSchools({ response }) {
        const schools = await School.all()

        return response.send(schools)
    }

    /**
     * Feature Endpoint, ktorý vracia dáta pre sekciu Prijímacie konanie - Porovnanie školských rokov. Výstupom je:
     * - všetky roky, pre ktoré boli naimportované prihlášky
     * - všetky študijné programy, na ktoré sa uchádzači hlásili
     * - metriky pre uchádzačov
     *   - bakalárskeho stupňa
     *   - inžinierskeho stupňa
     *   - oboch stupňov dohromady
     */
    async getAdmissionsYearComparison ({ response }) {
      const admissions = await Database
        .select('*')
        .from('ais_admissions')
        .where('stupen_studia', 'Bakalársky')

      let studyProgrammes = await Database.raw(`
        SELECT DISTINCT "Program_1" FROM ais_admissions
        WHERE stupen_studia = ?
      `, ['Bakalársky'])

      let years = await Database.raw(`
        SELECT DISTINCT "OBDOBIE" FROM ais_admissions
        WHERE stupen_studia = ?
      `, ['Bakalársky'])

      let ratios = {}
      ratios.approved = await Database.raw(`
        SELECT "OBDOBIE", COUNT("Rodné_číslo") AS apr, AVG("Body_celkom") as mean, percentile_disc(0.5) WITHIN GROUP (ORDER BY "Body_celkom") AS median FROM (
          SELECT "Rodné_číslo", "OBDOBIE", max("Body_celkom") AS "Body_celkom" FROM ais_admissions
          WHERE "Rozh" = 10 OR "Rozh" = 11 OR "Rozh" = 13
          GROUP BY "Rodné_číslo", "OBDOBIE"
        ) AS x
        GROUP BY "OBDOBIE"
      `)
      ratios.began_study = await Database.raw(`
        SELECT "OBDOBIE", COUNT("Rodné_číslo") AS bs, AVG("Body_celkom") as mean, percentile_disc(0.5) WITHIN GROUP (ORDER BY "Body_celkom") AS median FROM (
          SELECT "OBDOBIE", "Rodné_číslo", "Body_celkom" FROM ais_admissions
          WHERE ("Rozh" = 10 OR "Rozh" = 11 OR "Rozh" = 13) AND "Štúdium" = ?
        ) AS x
        GROUP BY "OBDOBIE"
      `, ['áno'])

      let bachelorRatios = {}
      bachelorRatios.approved = await Database.raw(`
        SELECT "OBDOBIE", COUNT("Rodné_číslo") AS apr, AVG("Body_celkom") as mean, percentile_disc(0.5) WITHIN GROUP (ORDER BY "Body_celkom") AS median FROM (
          SELECT "Rodné_číslo", "OBDOBIE", max("Body_celkom") AS "Body_celkom" FROM ais_admissions
          WHERE ("Rozh" = 10 OR "Rozh" = 11 OR "Rozh" = 13) AND stupen_studia = ?
          GROUP BY "Rodné_číslo", "OBDOBIE"
        ) AS x
        GROUP BY "OBDOBIE"
      `, ['Bakalársky'])
      bachelorRatios.began_study = await Database.raw(`
        SELECT "OBDOBIE", COUNT("Rodné_číslo") AS bs, AVG("Body_celkom") as mean, percentile_disc(0.5) WITHIN GROUP (ORDER BY "Body_celkom") AS median FROM (
          SELECT "OBDOBIE", "Rodné_číslo", "Body_celkom" FROM ais_admissions
          WHERE ("Rozh" = 10 OR "Rozh" = 11 OR "Rozh" = 13) AND "Štúdium" = ? AND stupen_studia = ?
        ) AS x
        GROUP BY "OBDOBIE"
      `, ['áno', 'Bakalársky'])

      let masterRatios = {}
      masterRatios.approved = await Database.raw(`
        SELECT "OBDOBIE", COUNT("Rodné_číslo") AS apr, AVG("Body_celkom") as mean, percentile_disc(0.5) WITHIN GROUP (ORDER BY "Body_celkom") AS median FROM (
          SELECT "Rodné_číslo", "OBDOBIE", max("Body_celkom") AS "Body_celkom" FROM ais_admissions
          WHERE ("Rozh" = 10 OR "Rozh" = 11 OR "Rozh" = 13) AND stupen_studia = ?
          GROUP BY "Rodné_číslo", "OBDOBIE"
        ) AS x
        GROUP BY "OBDOBIE"
      `, ['Inžiniersky'])
      masterRatios.began_study = await Database.raw(`
        SELECT "OBDOBIE", COUNT("Rodné_číslo") AS bs, AVG("Body_celkom") AS mean, percentile_disc(0.5) WITHIN GROUP (ORDER BY "Body_celkom") AS median FROM (
          SELECT "OBDOBIE", "Rodné_číslo", "Body_celkom" FROM ais_admissions
          WHERE ("Rozh" = 10 OR "Rozh" = 11 OR "Rozh" = 13) AND "Štúdium" = ? AND stupen_studia = ?
        ) AS x
        GROUP BY "OBDOBIE"
      `, ['áno', 'Inžiniersky'])

      ratios.approved = ratios.approved.rows
      ratios.began_study = ratios.began_study.rows

      bachelorRatios.approved = bachelorRatios.approved.rows
      bachelorRatios.began_study = bachelorRatios.began_study.rows

      masterRatios.approved = masterRatios.approved.rows
      masterRatios.began_study = masterRatios.began_study.rows

      studyProgrammes = studyProgrammes.rows.map(programme => programme.Program_1)
      years = years.rows.map(year => year.OBDOBIE)

      // zoradenie školských rokov podľa abecedy
      years.sort(function (item1, item2) {
        return item1.localeCompare(item2);
      })

      return response.send({ admissions, years, studyProgrammes, ratios, masterRatios, bachelorRatios })
    }

    /**
     * Feature Endpoint, ktorý vracia dáta pre sekciu Prijímacie konanie - Bakalársky stupeň. Výstupom je:
     * - všetky školy spojené s prihláškami a spojené s hodnoteniami podľa INEKO
     * - všetky prihlášky bakalárskeho stupňa spojené so školami
     */
    async getAdmissionsBachelor ({ request, response }) {
      const queryParams = await request.all()

      let schools
      if(queryParams.year !== 'all') {
        schools = await Database.raw(
            `
              SELECT sch.nazov, sch.druh_skoly, sch.kod_kodsko, tr.celkove_hodnotenie FROM ineko_schools AS sch
              LEFT JOIN ais_admissions AS adm ON adm.school_id = sch.kod_kodsko
              LEFT JOIN ineko_total_ratings AS tr ON tr.school_id = sch.kod_kodsko AND tr."OBDOBIE" = ?
              WHERE adm."OBDOBIE" = ?
            `, [queryParams.year, queryParams.year]
        )
      } else {
        schools = await Database.raw(
            `
              SELECT sch.nazov, sch.druh_skoly, sch.kod_kodsko, tr.celkove_hodnotenie FROM ineko_schools AS sch
              LEFT JOIN ineko_total_ratings AS tr ON tr.school_id = sch.kod_kodsko
            `
        )
      }

      let admissions
      if(queryParams.year == 'all') {
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
          .where('stupen_studia', 'Bakalársky')
      }
      else {
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
          .where('OBDOBIE', queryParams.year)
          .where('stupen_studia', 'Bakalársky')
      }

      return response.send({ schools: schools.rows, admissions })
    }

    /**
     * Feature Endpoint, ktorý vracia dáta pre sekciu Prijímacie konanie - Inžiniersky stupeň. Výstupom je:
     * - všetky univerzity, z ktorých sa hlásili uchádzači spolu s metrikami medián bodov, priemer bodov a počtom prihlášok z jednotlivých univerzít
     * - všetky prihlášky inžinierskeho stupňa
     */
    async getAdmissionsMaster({ request, response }) {
      const queryParams = await request.all()

      let admissions, universities
      if(queryParams.year == 'all') {
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .where('stupen_studia', 'Inžiniersky')

        universities = await Database.raw(`
          SELECT "Absolvovaná_VŠ", COUNT("Rodné_číslo") AS count, AVG("Body_celkom") AS mean, percentile_disc(0.5) WITHIN GROUP (ORDER BY "Body_celkom") AS median FROM ais_admissions
          WHERE "stupen_studia" = ?
          GROUP BY "Absolvovaná_VŠ"
        `, ['Inžiniersky'])
      } else {
        admissions = await Database
          .select('*')
          .from('ais_admissions')
          .where('OBDOBIE', queryParams.year)
          .where('stupen_studia', 'Inžiniersky')

        universities = await Database.raw(`
          SELECT "Absolvovaná_VŠ", COUNT("Rodné_číslo") AS count, AVG("Body_celkom") AS mean, percentile_disc(0.5) WITHIN GROUP (ORDER BY "Body_celkom") AS median FROM ais_admissions
          WHERE "OBDOBIE" = ? AND "stupen_studia" = ?
          GROUP BY "Absolvovaná_VŠ"
        `, [queryParams.year, 'Inžiniersky'])
      }

      return response.send({ admissions, universities: universities.rows })
    }

    /**
     * Endpoint, ktorý vracia všetky atribúty per zadanú tabuľku v databáze
     */
    async getAttrNames({ request, response }) {
      let queryParams = await request.all()

      let attrs = await Database.raw(`
        SELECT column_name
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = ?
      `, [queryParams.tableName])
      attrs = attrs.rows.reduce((acc, attr) => {
        acc.push(attr.column_name)
        return acc
      }, [])

      if(queryParams.tableName == 'ineko_schools') {
        return response.send({attrs, years: []})
      }

      let years = await Database.raw(`
        SELECT DISTINCT "OBDOBIE" FROM ${queryParams.tableName}
      `)
      years = years.rows.map(year => year.OBDOBIE)

      return response.send({ attrs, years })
    }
}

module.exports = GetController

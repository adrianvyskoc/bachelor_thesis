'use strict'

const Database = use('Database')

const Student = use('App/Models/Student')
const Attendance = use('App/Models/Attendance')
const Admission = use('App/Models/Admission')
const AttendanceType = use('App/Models/AttendanceType')
const StudyForm = use('App/Models/StudyForm')
const HighSchoolType = use('App/Models/HighSchoolType')
const Grade = use('App/Models/Grade')
const Subject = use('App/Models/Subject')
const School = use('App/Models/School')
const Pointer = use('App/Models/Pointer')
const Admin = use('App/Models/Admin')

class GetController {

    async getStudents ({ response }) {
        const students = await Student.all()

        return response.send(students)
    }

    async getAttendance ({ response }) {
        const attendance = await Attendance.all()

        return response.send(attendance)
    }

    async getAdmissions ({ response, params }) {
        let admissions
        if(params.year == 'all')
          admissions = await Database
            .select('*')
            .from('ais_admissions')
            .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
        else
          admissions = await Database
            .select('*')
            .from('ais_admissions')
            .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
            .where('OBDOBIE', params.year)

        return response.send(admissions)
    }

    async getAdmission ({ response, params }) {
        const admission = await Admission.find(params.id)
        const school = await School.find(admission.school_id)
        const pointers = await Database.table('ineko_individual_pointer_values').where('school_id', admission.school_id)
        const otherAdmissions = await Database.table('ais_admissions')
          .where('Rodné_číslo', admission.Rodné_číslo)

        return response.send({
            admission,
            school,
            pointers,
            otherAdmissions
        })
    }

    // ---
    // vrati userov ktori maju pristup do aplikácie
    async getUsers({ response }) {
      try {
        const data = await Database
          .table('admins')
          .where({access: 'true'})
          .orderBy('id', 'desc') // zoradim to, aby ked pridam niekoho bol stale na vrchu v tabulke

          return response
          .status(200)
          .send(data)
      } catch(e) {
        return response
          .status(500)
          .send(e)
      }
    }

    // prida usera a pristup do appky
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

    // prida prava admina
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

    // vymaze prava admina
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

    // vymaze pristup do appky
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

    // ---

    // data z druhej tabuky mi to vrati len ked v prvej už nic nie je 
    async getDateYears({request, response}) {
      let rawData = [];
      const data = await Database.raw(`
        select distinct 
          ais_state_exams_scenarios."OBDOBIE" 
        from 
          ais_state_exams_scenarios
        order by 
          ais_state_exams_scenarios."OBDOBIE" ASC
      `);

      // odstranenie nezelaneho tvaru ziskanych dat
      data.rows.map(e => {
        rawData.push(e['OBDOBIE']);
      })

      if (rawData.length == 0) {
      let rawData2 = [];
        const data2 = await Database.raw(`
          select distinct 
            ais_state_exams_overviews."OBDOBIE" 
          from 
            ais_state_exams_overviews
          order by 
            ais_state_exams_overviews."OBDOBIE" ASC
        `);

        // odstranenie nezelaneho tvaru ziskanych dat
        data2.rows.map(e => {
          rawData2.push(e['OBDOBIE']);
        })
        
        return response
          .status(200)
          .send(rawData2)
      }

      return response
        .status(200)
        .send(rawData)
    }

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

    // ---
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

    // Todo
    async getStateFinalExamsIng ({ response }) {
      try {
        // dorobit select podla dat
        const data = await Database.raw(``)

        return response
          .status(200)
          .send(data.rows)
      } catch(e) {
        console.log('error', e)
        return response
          .status(500)
          .send(e)
      }
    }

    // Todo
    async updateStateFinalExamsIng ({ response, request }) {
      const data = request.body
      try {
        await Database
          .table('ais_state_exams_overviews_ing')
          .where({ id:data.id })
          .update({
          // nazovTabulky: data.nazovParametruCoPosielamzFE
          // spisat si stlpce ktore sa budu doplnat
          })

        return response
          .status(200)
          .send(true)
      } catch(e) {
        console.log('error', e)
        return response
          .status(500)
          .send(e)
      }

    }
    // ---

    async getFinalExamConfiguration ({ response }) {
      const data = await Database
        .table('state_exams_params')

        if (data[0] == undefined) {
          console.log('tralaalal som tu' + data[0])

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

    async updateFinalExamConfiguration ({ response, request }) {
      const data = request.body;
      console.log('dataaaa')
      console.log(data);
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

    // ---

    async getGrades ({ response }) {
        const grades = await Grade.all()

        return response.send(grades)
    }

    async getSubjects({ response }) {
        const subjects = await Subject.all()

        return response.send(subjects)
    }

    async getSchools({ response }) {
        const schools = await School.all()

        return response.send(schools)
    }

    // API endpoints for usecases
    async getAdmissionsOverview ({ request, response }) {
      const queryParams = await request.all()

      const admissionsAttrs = [
        'ais_admissions.id',
        'ais_admissions.Meno',
        'ais_admissions.Priezvisko',
        'ais_admissions.E_mail',
        'ais_admissions.Všeobecné_študijné_predpoklady_SCIO_VŠP',
        'ais_admissions.Písomný_test_z_matematiky_SCIO_PTM',
        'ais_admissions.Externá_maturita_z_matematiky_EM',
        'ais_admissions.Externá_maturita_z_cudzieho_jazyka_ECJ',
        'ais_admissions.Program_1',
        'ais_admissions.Pohlavie',
        'ais_admissions.Maturita_1',
        'ais_admissions.school_id',
        'ais_admissions.stupen_studia',
        'ais_admissions.Body_celkom',
        'ais_admissions.Rozh',
        'ais_admissions.Štúdium',
        'ais_admissions.Občianstvo'
      ]
      const schoolsAttrs = ['ineko_schools.typ_skoly', 'ineko_schools.sur_y', 'ineko_schools.sur_x', 'ineko_schools.kraj']

      const schools = await Database
        .select(...schoolsAttrs, 'ineko_schools.ulica', 'ineko_schools.nazov', 'ineko_schools.kod_kodsko', 'ineko_schools.email', 'ineko_total_ratings.celkove_hodnotenie')
        .from('ineko_schools')
        .leftJoin('ineko_total_ratings', 'ineko_total_ratings.school_id', 'ineko_schools.kod_kodsko')

      let admissions
      let regionMetrics

      if(queryParams.year == 'all') {
        admissions = await Database
          .select(...admissionsAttrs, ...schoolsAttrs)
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
        regionMetrics = await Database.raw(`
          SELECT
            COUNT(ais_admissions.id),
            AVG(ais_admissions."Body_celkom") as mean,
            percentile_disc(0.5) within group (order by ais_admissions."Body_celkom") as median,
            ineko_schools.kraj
          FROM ais_admissions
          JOIN ineko_schools ON ais_admissions.school_id = ineko_schools.kod_kodsko
          GROUP BY ineko_schools.kraj
          `
        )
      }
      else {
        admissions = await Database
          .select(...admissionsAttrs, ...schoolsAttrs)
          .from('ais_admissions')
          .leftJoin('ineko_schools', 'ais_admissions.school_id', 'ineko_schools.kod_kodsko')
          .where('OBDOBIE', queryParams.year)
        regionMetrics = await Database.raw(`
          SELECT
            COUNT(ais_admissions.id),
            AVG(ais_admissions."Body_celkom") as mean,
            percentile_disc(0.5) within group (order by ais_admissions."Body_celkom") as median,
            ineko_schools.kraj
          FROM ais_admissions
          JOIN ineko_schools ON ais_admissions.school_id = ineko_schools.kod_kodsko
          WHERE ais_admissions."OBDOBIE" = ?
          GROUP BY ineko_schools.kraj
          `, [queryParams.year]
        )
      }

      return response.send({ schools, admissions, regionMetrics: regionMetrics.rows })
    }

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

'use strict'

const Database = use('Database')
const Admission = use('App/Models/Admission')
const School = use('App/Models/School')

/**
 * Tento controller obsahuje API endpointy, ktoré slúžia na manipuláciu s dátami z INEKO a s prihláškami
 */
class AdmissionController {

  /**
   * Endpoint, ktorý vráti buď všetky prihlášky, alebo prihlášky zo zvoleného školského roku
   */
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

  /**
     * Endpoint, ktorý vráti prihlášku podľa zvoleného ID. Spolu s prihláškou sa vráti aj škola, ktorú navštevoval daný uchádzač, jeho ostatné prihlášky
     * a ukazovatele kvality školy, ktorú navštevoval.
     */
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

  /**
   * Endpoint zodpovedný na úpravu konkrétnej prihlášky podľa ID.
   */
  async updateAdmission({ request }) {
    const updatedAdmission = await request.all()
    const id = updatedAdmission.id
    const admission = await Admission.find(id)

    delete updatedAdmission['id']

    if(!admission) {
      return {
        "success": false,
        "message": "Prihláška so zadaným id neexistuje."
      }
    }

    try {
      await Database
        .table('ais_admissions')
        .where('id', id)
        .update(updatedAdmission)
    } catch(err) { console.log(err) }

    return {
      "success": true,
      "message": "Prihláška bola úspešne zmenená."
    }
  }

  /**
   *  Endpoint zodpovedný za vymazanie konkrétnej prihlášky podľa ID.
   */
  async deleteAdmission({ params }) {
    const { id } = params
    const admission = await Admission.find(id)

    if(!admission) {
      return {
        "success": false,
        "message": "Prihláška so zadaným id neexistuje."
      }
    }

    try {
      await admission.delete()
    } catch(err) { console.log(err) }

    return {
      "success": true,
      "message": "Prihláška so zadaným id bola úspešne zmazaná."
    }
  }

  /**
   * Endpoint, ktorý vracia všetky prihlášky podľa zvoleného priezviska.
   */
  async getAdmissionsBySurname({ request }) {
    const queryParams = await request.all()

    const admissions = await Database
      .select('*')
      .from('ais_admissions')
      .where('Priezvisko', queryParams.surname)

    return { admissions }
  }

  /**
   * Endpoint, ktorý vymaže všetky prihlášky zo systému
   */
  async deleteAllAdmissions() {
    try {
      await Database.truncate('ais_admissions')
      return {
        "success": true,
        "message": "Všetky prihlášky boli úspešne zmazané."
      }
    } catch(err) {
      return {
        "success": false,
        "message": "Nastala chyba pri odstraňovaní všetkých záznamov z prijímacieho konania."
      }
    }
  }

  /**
   * Endpoint, ktorý zmaže všetky prihlášky so zvoleným školským rokom
   */
  async deleteAdmissionsForGivenYear({ params }) {
    try {
      await Database
        .table('ais_admissions')
        .where('OBDOBIE', params.year)
        .delete()

      return {
        "success": true,
        "message": `Prihlášky pre rok ${params.year} boli úspešne zmazané.`
      }
    } catch(err) {
      return {
        "success": false,
        "message": `Vyskytla sa chyba pri zmazávaní prihlášok pre rok ${params.year}.`
      }
    }
  }

  /**
   * Endpoint, ktorý zmaže vybraný typ dát z INEKA pre zvolený rok.
   */
  async deleteInekoDataForGivenYear({ params }) {
    try {
      await Database
        .table(params.inekoData)
        .where('OBDOBIE', params.year)
        .delete()

      return {
        "success": true,
        "message": `Zvolené dáta pre rok ${params.year} boli úspešne zmazané.`
      }
    } catch(err) {
      return {
        "success": false,
        "message": `Vyskytla sa chyba pri zmazávaní zvolených dát pre rok ${params.year}.`
      }
    }
  }

  /**
   * Endpoint, ktorý zmený školský rok pre prihlášky, pre zvolený  pôvodný školský rok,na zvolený cieľový školský rok.
   */
  async changeYearForGivenYear({ request }) {
    const years = await request.all()
    let count = await Database
      .from('ais_admissions')
      .where('OBDOBIE', years.fromYear)
      .count()
    count = Number(count[0].count)

    if(!count) {
      return {
        "success": false,
        "message": `V systéme sa nenachádzajú žiadne prihlášky s školským rokom ${years.fromYear}.`
      }
    }

    try {
      await Database
        .table('ais_admissions')
        .where('OBDOBIE', years.fromYear)
        .update('OBDOBIE', years.toYear)

      return {
        "success": true,
        "message": `Prihláškam so školským rokom ${years.fromYear} bol úspešne zmenený školský rok na ${years.toYear}.`
      }
    } catch(err) {
      return {
        "success": false,
        "message": `Vyskytla sa chyba pri upravovaní školského roku pre prihlášky s rokom ${years.fromYear}.`
      }
    }
  }

  /**
   * Endpoint, ktorý slúži na zmenu pôvodného školského roku na cieľový školský rok pre zvolené dáta z INEKO.
   */
  async changeYearForInekoData({ request }) {
    const data = await request.all()
    let count = await Database
      .from(data.inekoData)
      .where('OBDOBIE', data.fromYear)
      .count()
    count = Number(count[0].count)

    if(!count) {
      return {
        "success": false,
        "message": `V systéme sa nenachádzajú žiadne dáta zvoleného typu s školským rokom ${data.fromYear}.`
      }
    }

    try {
      await Database
        .table(data.inekoData)
        .where('OBDOBIE', data.fromYear)
        .update('OBDOBIE', data.toYear)

      return {
        "success": true,
        "message": `Zvoleným dátam so školským rokom ${data.fromYear} bol úspešne zmenený školský rok na ${data.toYear}.`
      }
    } catch(err) {
      return {
        "success": false,
        "message": `Vyskytla sa chyba pri upravovaní školského roku pre zvolené dáta s rokom ${data.fromYear}.`
      }
    }
  }

  /**
   * Feature Endpoint, ktorý vracia dáta pre sekciu Prijímacie konanie - Všeobecný prehľad. Výstupom je:
   * - všetky školy naimportované v systéme spolu s ich hodnotením podľa INEKO
   * - všetky prihlášky spojené so školami, ktoré navštevovali uchádzači
   * - metriky podľa krajov
   */
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
}

module.exports = AdmissionController

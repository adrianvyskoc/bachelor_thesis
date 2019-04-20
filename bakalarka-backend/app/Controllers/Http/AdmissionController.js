'use strict'

const Database = use('Database')
const Admission = use('App/Models/Admission')

class AdmissionController {

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

  async getAdmissionsBySurname({ request }) {
    const queryParams = await request.all()

    const admissions = await Database
      .select('*')
      .from('ais_admissions')
      .where('Priezvisko', queryParams.surname)

    return { admissions }
  }

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
}

module.exports = AdmissionController

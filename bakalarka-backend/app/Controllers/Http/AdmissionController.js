'use strict'

const Database = use('Database')
const Admission = use('App/Models/Admission')

class AdmissionController {

  async addAdmission({ request }) {
    const data = await request.all()
  }

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
}

module.exports = AdmissionController

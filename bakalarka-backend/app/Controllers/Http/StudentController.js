'use strict'

const Database = use('Database')

const Student = use('App/Models/Student')

class StudentController {

  async getDiplomas ({ response , request, params}) {
    

    let ownDiplomas  = '';
      
    ownDiplomas = await Database.table('diplomas').where('AIS_ID', params.id)

    return response.send({
      ownDiplomas
    })
  }

  /**
   * Endpoint, ktorý vráti všetky data o diplomoch
   */

  async getDiplomaData ({ response}) {
    let diplomasData = '';
    
    diplomasData = await Database.table('list_diplomas')

    let objectZameranie = {
      "matematika": await Database.distinct('nazov').from('list_diplomas').where('zameranie', 'matematika'),
      "informatika": await Database.distinct('nazov').from('list_diplomas').where('zameranie', 'informatika'),
      "SOČ": await Database.distinct('nazov').from('list_diplomas').where('zameranie', 'SOČ'),
      "iné": await Database.distinct('nazov').from('list_diplomas').where('zameranie', 'iné'),
      "fyzika": await Database.distinct('nazov').from('list_diplomas').where('zameranie', 'fyzika')
    }

    return response.send({
      diplomasData,
      objectZameranie
    })
  }


  /**
   * Endpoint, ktorý vráti všetkých študentov v systéme
   */
  async getStudents ({ response , request}) {
    

    const queryParams = await request.all()
    console.log(queryParams)
    let allDataAdmissions = '';
    let countS 
    let countAll 
    let countBez 
    let countBezNull

    
    if(queryParams.year == 'all') {
      if(queryParams.program == 'all'){
        allDataAdmissions = await Database.table('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky')

        countS = await Database.from('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky').whereNotNull('Exb_celk').where('Exb_celk', '>', 0).count() 
        countAll = await Database.from('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky').count()
        countBezNull = await Database.from('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky').whereNull('Exb_celk').count() 
        countBez = await Database.from('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky').whereNotNull('Exb_celk').where('Exb_celk', '<', 1).count() 
        console.log(countS)
        console.log(countAll)
        console.log(countBezNull)
        console.log(countBez)

      }else{
        allDataAdmissions = await Database.table('ais_admissions').whereNotNull('AIS_ID').where('Prijatie_na_program', queryParams.program).where('stupen_studia', 'Bakalársky')
      }
    } else if(queryParams.program == 'all'){
      allDataAdmissions = await Database.table('ais_admissions').where('OBDOBIE', queryParams.year).whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky') 

      countS = await Database.from('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky').where('OBDOBIE', queryParams.year).whereNotNull('Exb_celk').where('Exb_celk', '>', 0).count() 
      countAll = await Database.from('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky').where('OBDOBIE', queryParams.year).count()
      countBezNull = await Database.from('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky').where('OBDOBIE', queryParams.year).whereNull('Exb_celk').count() 
      countBez = await Database.from('ais_admissions').whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky').where('OBDOBIE', queryParams.year).whereNotNull('Exb_celk').where('Exb_celk', '<', 1).count() 
      console.log(countS)
      console.log(countAll)
      console.log(countBezNull)
      console.log(countBez)

    }else{
      allDataAdmissions = await Database.table('ais_admissions').whereNotNull('AIS_ID').where('Prijatie_na_program', queryParams.program).where('OBDOBIE', queryParams.year).where('stupen_studia', 'Bakalársky')
    }


    let years = await Database.raw(`
      SELECT DISTINCT "OBDOBIE"  from ais_admissions
    `);

    let programs = await Database.table('ais_admissions').distinct('Prijatie_na_program').where('stupen_studia', 'Bakalársky').whereNotNull('AIS_ID')
    

    return response.send({
      allDataAdmissions,
      years,
      programs
      /*countS, 
      countBez,
      countAll*/
    })
  }


  /**
   * Endpoint, ktorý vráti všetkých študentov so zadanym menom
   */
  async getStudentsName ({ response , request, params}) {
    
    const queryParams = await request.all()
    console.log(queryParams)
    let allDataAdmissions = '';

    if(queryParams.year == 'all') {
      if(queryParams.program == 'all'){
        allDataAdmissions = await Database.table('ais_admissions').where('Meno', params.name).whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky')
      }else{
        allDataAdmissions = await Database.table('ais_admissions').where('Meno', params.name).whereNotNull('AIS_ID').where('Prijatie_na_program', queryParams.program).where('stupen_studia', 'Bakalársky')
      } 
    } else if (queryParams.program == 'all'){
      allDataAdmissions = await Database.table('ais_admissions').where('Meno', params.name).where('OBDOBIE', queryParams.year).whereNotNull('AIS_ID').where('stupen_studia', 'Bakalársky') 
    }else{
      allDataAdmissions = await Database.table('ais_admissions').where('Meno', params.name).whereNotNull('AIS_ID').where('Prijatie_na_program', queryParams.program).where('OBDOBIE', queryParams.year).where('stupen_studia', 'Bakalársky')
    }

    let years = await Database.raw(`
      SELECT DISTINCT "OBDOBIE"  from ais_admissions
    `);

    let programs = await Database.table('ais_admissions').distinct('Prijatie_na_program').where('stupen_studia', 'Bakalársky').whereNotNull('AIS_ID')

    return response.send({
      allDataAdmissions,
      years,
      programs
    })
  }


  /**
   * Endpoint, ktorý vráti všetky informácie týkajúce sa jedného študenta. Študent je v systéme podľa AIS_ID.
   */
  async getStudent({ params, response }) {

    const student = await Student.find(params.id)
    let grades = await Database.raw(`
      SELECT * FROM ais_grades as grd
      JOIN ais_subjects as sbj ON grd."PREDMET_ID" = sbj.id
      WHERE grd."AIS_ID" = ${params.id}
    `)
    const admissions = await Database
      .select('id')
      .from('ais_admissions')
      .where('AIS_ID', params.id)

    // group by obdobie
    grades = grades.rows.reduce((acc, grade) => {
      // ak skupina s daným obdobím neexistuje, inicializujeme ju
      if (!acc[grade.OBDOBIE])
        acc[grade.OBDOBIE] = []

      acc[grade.OBDOBIE].push(grade)

      return acc
    }, {})

    // group obdobia by semester
    Object.keys(grades).forEach((schoolYear) => {
      grades[schoolYear] = grades[schoolYear].reduce((acc, grade) => {
        // ak skupina s daným obdobím neexistuje, inicializujeme ju
        if (!acc[grade.SEMESTER])
          acc[grade.SEMESTER] = []

        acc[grade.SEMESTER].push(grade)

        return acc
      }, {})
    })

    // výpočet váženého študijného priemeru za jednotlivé semestre
    // TODO:

    return response.send({
      student,
      grades,
      admissions
    })
  }

}

module.exports = StudentController

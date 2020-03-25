'use strict'

const Database = use('Database')

const Student = use('App/Models/Student')

class StudentController {

  async getDiplomas ({ response , request}) {
    const queryParams = await request.all()

    let ownDiplomas  = '';
      
    //diplomas = await Database.table('diplomas').where('AIS_ID', queryParams.aisId)

    

    ownDiplomas = await Database.raw(`
      SELECT * from diplomas
    `);

    return response.send({
      ownDiplomas
    })
  }


  /**
   * Endpoint, ktorý vráti všetkých študentov v systéme
   */
  async getStudents ({ response , request}) {
    const queryParams = await request.all()
  
    let allDataAdmissions = '';
    let students = '';

    //tento if je zatial nefunkčný 
    if (queryParams.name) {
      
      students = await Database.table('ais_students').where('MENO', queryParams.name)
    
    } else {
    

      students = await Student.all()
    }
    
    allDataAdmissions = await Database.raw(`
      SELECT "AIS_ID", "Priezvisko", "Meno", "OBDOBIE", "Prijatie_na_program", "Exb_celk" from ais_admissions WHERE "AIS_ID" IS NOT NULL 
    `);


    let years = await Database.raw(`
      SELECT DISTINCT "OBDOBIE"  from ais_admissions
    `);

    return response.send({
      students,
      allDataAdmissions,
      years
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

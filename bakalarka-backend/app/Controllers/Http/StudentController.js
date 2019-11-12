'use strict'

const Database = use('Database')

const Student = use('App/Models/Student')

class StudentController {

  /**
   * Endpoint, ktorý vráti všetkých študentov v systéme
   */
  async getStudents ({ response }) {
    const students = await Student.all()

    return response.send(students)
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

'use strict'

const Database = use('Database')

const Student = use('App/Models/Student')
const Grade = use('App/Models/Grade')

class StudentController {

  async getStudent({ params, response }) {

    const student = await Student.find(params.id)
    let grades = await Database.raw(`
      SELECT * FROM ais_grades as grd
      JOIN ais_subjects as sbj ON grd."PREDMET_ID" = sbj.id
      WHERE grd."AIS_ID" = ${params.id}
    `)

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

    return response.send({
      student,
      grades
    })
  }

}

module.exports = StudentController

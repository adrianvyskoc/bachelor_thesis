'use strict'

const Student = use('App/Models/Student')

class StudentController {

  async getStudent({ params, response }) {

    const student = await Student.find(params.id)

    return response.send({
      student: student
    })
  }

}

module.exports = StudentController

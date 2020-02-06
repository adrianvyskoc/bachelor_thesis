'use strict'

const Student = use('App/Models/Student')

class PredictionController {

    async index () {
        
        let students = Student.all();

        return {
            students
        }

    }

}

module.exports = PredictionController

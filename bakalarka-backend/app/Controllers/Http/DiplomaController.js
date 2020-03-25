'use strict'

const Database = use('Database')

class DiplomaController {

    async addDiploma({ request, response }) {

        const data = await request.all();   

        console.log(data)
        try {
            await Database
                .table('diplomas')
                .insert({
                    AIS_ID: data.AIS_ID,
                    type: data.type,
                    diploma_title: data.diploma_title,
                    round: data.round,
                    position: data.position  
                })

            return response.send(true);
        } catch (err) {
            return response.send(err);
        }
    }

    
}

module.exports = DiplomaController

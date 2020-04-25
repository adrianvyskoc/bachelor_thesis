'use strict'

const Database = use('Database')

class DiplomaController {

    async addDiploma({ request, response }) {

        const data = await request.all();
        let bodik   

        if(data.round) {
           if(data.position) {
                bodik = await Database.select('body').from('list_diplomas').where('zameranie', data.type).where('nazov', data.diploma_title).where('kolo', data.round).where('umiestnenie', data.position)
           }
           bodik = await Database.select('body').from('list_diplomas').where('zameranie', data.type).where('nazov', data.diploma_title).where('kolo', data.round)
        } else if(data.position) {
            bodik = await Database.select('body').from('list_diplomas').where('zameranie', data.type).where('nazov', data.diploma_title).where('umiestnenie', data.position)
        } else{
            bodik = await Database.select('body').from('list_diplomas').where('zameranie', data.type).where('nazov', data.diploma_title)
        }
           

        let student = await Database.table('ais_admissions').where('AIS_ID', data.AIS_ID).where('OBDOBIE', data.OBDOBIE).where('Prijatie_na_program', data.Prijatie_na_program)
        console.log(student)

       if(student[0].Exb_celk == null) {
            console.log("je tam null - mozes pridat body")
            try {
                await Database.table('ais_admissions')
                    .where('AIS_ID', data.AIS_ID)
                    .where('OBDOBIE', data.OBDOBIE)
                    .where('Prijatie_na_program', data.Prijatie_na_program)
                    .update('Exb_celk', bodik[0].body)
                    
                return response.send(true);
            } catch (err) {
                return response.send(err);
            }
            
        } else if(student[0].Exb_celk == 0){
            console.log("je tam 0")
        } else {
            console.log("je tam nejaky pocet bodov")
        }
        

        
        try {
            await Database
                .table('diplomas')
                .insert({
                    AIS_ID: data.AIS_ID,
                    rok_prijatia: data.OBDOBIE,
                    studijny_program: data.Prijatie_na_program,
                    type: data.type,
                    diploma_title: data.diploma_title,
                    round: data.round,
                    position: data.position,
                    points: bodik[0].body
                })
            return response.send({
                type: 'success',
                message: 'Priradenie diplomu úspešné'
              });
        } catch (err) {
            return response.send({
                type: 'error',
                message: 'Nepodarilo sa diplom priradiť'
              });
        }
    }

    async addDiplomaExtra({ request, response }) {

        const data = await request.all();
        
        try {
            await Database
                .table('diplomas')
                .insert({
                    AIS_ID: data.AIS_ID,
                    rok_prijatia: data.OBDOBIE,
                    studijny_program: data.Prijatie_na_program,
                    type: data.type,
                    diploma_title: data.diploma_title,
                    round: data.round,
                    position: data.position,
                    points: data.points
                })
            return response.send({
                type: 'success',
                message: 'Priradenie diplomu úspešné'
              });
        } catch (err) {
            return response.send({
                type: 'error',
                message: 'Nepodarilo sa diplom priradiť'
              });
        }
    }

    async getSkuska ({ response}) {
        
        
        let oznam = "Diplom pridaný"
        
    
        return response.send({
          oznam
        })
    }

    
}



module.exports = DiplomaController

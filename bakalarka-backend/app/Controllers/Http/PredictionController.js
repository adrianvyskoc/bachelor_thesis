'use strict'

const Student = use('App/Models/Student')

const Database = use('Database')

/*
async index ({ response , params }) {
        const zadane_meno = params.meno
        console.log("som v indexe2")
        const odpoved = "z backendu" + zadane_meno
        return response.send( {
            odpoved
        })

    }

a v routes je >
 Route.get('predictions/:meno', 'PredictionController.index')

 a v http requeste potom staci  http://localhost:3333/api/predictions/magdik
*/

class PredictionController {

    async index ({ response , request }) {
      
        response.implicitEnd = false

        var request = require('request')

        function ping() {
            return new Promise(function(fulfill, reject) {
                request.get('http://localhost:5000/', function(error, response, body) {
                    if (!error) {
                        fulfill(body);
                        console.log(body)
                        console.log("uspech")
                    }
                    else {
                        reject(error, response)
                        console.log("chyba")
                    }
                });
            });
        }

        ping().then(
            function(result) {
                console.log("uspech v then");
                console.log(result)
                
                response.send(result);
            },
            function(error) {
                console.log("error v then");
            }
        );
        
    }

    async predict ( {response, request} ) {
        const request_params = await request.all()

        let school_year = '';
        let subject = '';

        school_year = request_params.school_year
        subject = request_params.subject

        console.log(school_year)
        console.log(subject)

        //kontrola, ci existuje taky predikcny model
        //POZOR urobit samostatnu kontrolu pri model vsetko
        
        // const model = await Database
        //         .from('prediction_models')
        //         .join('ais_subjects', 'subject_id', 'ais_subjects.id')
        //         .where('PREDMET', request_params.subject)
        //zle to joinuje, treba dva selecty alebo to nejak opravit
        
        
        const model = await Database
                    .from('prediction_models')
                    .where('subject_id', 93)
            
        
        if (model.length == 0) {
            //nenasiel sa ziaden model pre dany predmet
            console.log("nenasiel sa model");
            response.send("chyba model");
        }
        else {
            console.log("mam model")
        }
        console.log(model)

        var model_id = model[0].id
        console.log(model_id)

        //kontrola, ci su importovane data z daneho roku
        //TODO

        response.implicitEnd = false

        var request = require('request')

        let request_string = "http://localhost:5000/prediction?school_year=" + school_year + "&model=" + model_id;   

        function request_prediction() {
            return new Promise(function(fulfill, reject) {
                request.get(request_string, function(error, response, body) {
                    if (!error) {
                        fulfill(body);
                        console.log(body)
                        console.log("uspech")
                    }
                    else {
                        reject(error, response)
                        console.log("chyba")
                    }
                });
            });
        }

        request_prediction().then(
            function(result) {
                console.log("uspech v then");
                console.log(result)                
                response.send(result);
            },
            function(error) {
                console.log("error v then");
            }
        );




    }

    /**
     * Funkcia, ktorá vráti zoznam predmetov, pre ktoré sú dostupné modely
     * @param {*} param0 
     */
    async get_subjects ( { response }) {
        const subjects = await Database.raw(`
        SELECT distinct "PREDMET"
        FROM prediction_models
        JOIN ais_subjects "as" on prediction_models.subject_id = "as".id`)

        let rawSubjects = []
        subjects.rows.map(e => {
            rawSubjects.push(e["PREDMET"]);
        })

        const data = await Database
            .from('prediction_models')
            .where('type', 'komplex')

        if (data.length) {
            rawSubjects.push("Celková predikcia")
        }

        return response
        .status(200)
        .send(rawSubjects)
            
    }

    /**
     * Funkcia, ktorá vráti všetky modely spolu s predmetmi, pre ktoré sú vytvorené
     * @param {*} param0 
     */
    async get_all_models({ response }) {
        const data = await Database
        .select('prediction_models.id', 'name', 'PREDMET')
        .from('prediction_models')
        .leftJoin('ais_subjects', 'subject_id', 'ais_subjects.id')

        console.log(data)
        
        return response
        .status(200)
        .send(data)

    }

    async get_model( { request, response }) {
        const request_params = await request.all()

        const model_id = request_params.model_id
        
        const data = await Database
            .from('prediction_models')
            .where('id', model_id)

        return response.status(200).send(data)
    }

    async get_imputers( {  request, response }) {
        const request_params = await request.all()

        const model_id = request_params.model_id

        const data = await Database
            .from('imputers')
            .where('id_model', model_id)

        return response.status(200).send(data)
    }

    /**
     * Funkcia, ktorá v databáze vymaže vybraný model a všetky imputery, ktoré k nemu patria
     * @param {*} id modelu, ktorý má byť vymazaný
     */
    async delete_model( {request, response}) {
        const request_params = await request.all()

        const model_id = request_params.model_id

        try{
            await Database
            .table('imputers')
            .where('id_model', model_id)
            .delete()
            
            await Database
            .table('prediction_models')
            .where('id', model_id)
            .delete()

            return response
              .status(200)
              .send(true)
    
          } catch(e) {
            console.log('error', e);
            return response
              .status(500)
              .send(e)
          }

    
    }

    async get_years( { response}) {
        let rawData = []
        const data = await Database
            .from('ais_grades')
            .distinct('OBDOBIE')

            //prevod z json na pole
        data.map(e => {
            rawData.push(e['OBDOBIE']);
           })

        return response.status(200).send(rawData)
    }

    /**
     * Funkcia vráti všetky tabuľky v DB, ktoré obsahujú nejaké importované dáta
     * @param {*} param0 
     */
    async get_tables( { response } ) {

        let mock_data = ['ais_admissions', 'ineko_schools', 'ineko_total_ratings', 'ineko_percentils']
        return response.status(200).send(mock_data)
    }

    async get_all_subjects ( { response }) {

        let mock_data = ['Matematická analýza', 'Predmet 2', 'Predmet 3']
        return response.status(200).send(mock_data)
    }

    async create_model ( { request, response }) {
        const request_params = await request.all()
        //skontrolovat ci uz nahodou neexistuje model s rovnakym nazvom

        //ostatne data by mali byť okej, lebo sa zobrazujú len tie, ktoré sú dostupné v dB
    }

       
}

module.exports = PredictionController

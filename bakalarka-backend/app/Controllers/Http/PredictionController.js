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

    async index({ response, request }) {

        response.implicitEnd = false

        var request = require('request')

        function ping() {
            return new Promise(function (fulfill, reject) {
                request.get('http://localhost:5000/', function (error, response, body) {
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
            function (result) {
                console.log("uspech v then");
                console.log(result)

                response.send(result);
            },
            function (error) {
                console.log("error v then");
            }
        );

    }

    async predict({ response, request }) {
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
            return new Promise(function (fulfill, reject) {
                request.get(request_string, function (error, response, body) {
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
            function (result) {
                console.log("uspech v then");
                console.log(result)
                response.send(result);
            },
            function (error) {
                console.log("error v then");
            }
        );




    }

    /**
     * Funkcia, ktorá vráti zoznam predmetov, pre ktoré sú dostupné modely
     * @param {*} param0 
     */
    async get_subjects({ response }) {
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

    async get_model({ request, response }) {
        const request_params = await request.all()

        const model_id = request_params.model_id

        const data = await Database
            .from('prediction_models')
            .where('id', model_id)

        return response.status(200).send(data)
    }

    async get_model_details({ request, response }) {
        const request_params = await request.all()

        const model_id = request_params.model_id
        const data = await Database
            .select('prediction_models.id', 'name', 'type', 'PREDMET', 'used_years', 'used_tables', 'size_of_training_set', 'accuracy', 'f1', 'precision', 'recall')
            .from('prediction_models')
            .leftJoin('ais_subjects', 'subject_id', 'ais_subjects.id')
            .where('prediction_models.id', model_id)


        let model = data[0]
        model.used_years = data[0].used_years.split(",").join(", ")
        model.used_tables = data[0].used_tables.split(",").join(", ")

        return response.status(200).send(model)
    }

    async get_imputers({ request, response }) {
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
    async delete_model({ request, response }) {
        const request_params = await request.all()

        const model_id = request_params.model_id

        try {
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

        } catch (e) {
            console.log('error', e);
            return response
                .status(500)
                .send(e)
        }


    }

    async get_years({ response }) {
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
    async get_tables({ response }) {

        const possible_tables = ['ais_admissions', 'ineko_schools', 'ineko_total_ratings', 'ineko_percentils', 'ineko_individual_pointer_values', 'ineko_additional_data', 'ais_attendances']
        let available_tables = []

        for (var i = 0; i < possible_tables.length; i++) {

            let sql_string = 'select count(*) from ' + possible_tables[i]

            const count = await Database
                .raw(sql_string)

            console.log(count)
            // return count.rows[0].count


            if (count.rows[0].count > 0) {
                available_tables.push(possible_tables[i])
            }
        }



        console.log(available_tables)
        return response.status(200).send(available_tables)
    }

    /**
     * Funkcia vráti všetky predmety z prvého ročníka zimný semester.
     * @param {*} param0 
     */
    async get_all_subjects({ response }) {

        let mock_data = ['Matematická analýza', 'Algebra a diskrétna matematika', 'Anglický jazyk', 'Procedurálne programovanie', 'Metódy inžinierskej práce']
        return response.status(200).send(mock_data)
    }

    async create_model({ request, response }) {
        const request_params = await request.all()
        //skontrolovat ci uz nahodou neexistuje model s rovnakym nazvom
        const models = await Database
            .select('name')
            .from('prediction_models')

        let models_array = []
        models.map(e => {
            models_array.push(e['name']);
        })


        if (models_array.includes(request_params.name)) {
            console.log("Zly nazov" + request_params.name)
            return response.status(505).send("Zadaný názov modelu už existuje. Zadajte prosím iný.")
        }

        //ostatne data by mali byť okej, lebo sa zobrazujú len tie, ktoré sú dostupné v dB

        let model_type = ''
        let id_subject = 0

        if (request_params.subject == 'Všeobecný model') {
            model_type = 'komplex'
        }
        else {
            model_type = 'simple'
            var id_subject_data = await Database
                .select('id')
                .from('ais_subjects')
                .where('PREDMET', request_params.subject)

            id_subject = id_subject_data[0].id
        }


        response.implicitEnd = false

        var request = require('request')

        let request_string = "http://localhost:5000/create_model?selected_tables=" + request_params.tables + "&years=" + request_params.years + "&subject_id=" + id_subject + "&name_of_model=" + request_params.name + "&type_of_model=" + model_type;

        function request_create_model() {
            return new Promise(function (fulfill, reject) {
                request.get(request_string, function (error, response, body) {
                    if (!error) {
                        fulfill(body);
                        console.log("telo" + body)
                    }
                    else {
                        reject(error, response)
                    }
                });
            });
        }

        request_create_model().then(
            function (result) {

                console.log(result)
                if (result != "OK") {
                    return response.status(505).send("Chyba v Pythone 33")

                }
                response.send()
            },
            function (error) {
                console.log(error);
                console.log()
                if (error.code == 'ECONNREFUSED') {
                    return response.status(505).send("Skontrolujte, či máte spustený Flask")
                }
                return response.status(505).send("Chyba v Pythone")
            }
        );


    }


}

module.exports = PredictionController

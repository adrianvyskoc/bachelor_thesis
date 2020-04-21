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
        let model_id = 0;

        school_year = request_params.school_year
        model_id = request_params.model_id

        console.log(school_year)
        console.log(model_id)

        //predikcny model musi existovat, lebo sa zobrazuju len modely, ktore su v DB

        //kontrola, ci su importovane data z daneho roku
        //ais_admission musi byt vzdy
        // const ais_admissions = await Database.raw(`SELECT count(*)
        //                                     FROM ais_admissions
        //                                     WHERE "OBDOBIE" = '2018-2019' and stupen_studia = 'Bakalársky'`)

        const count_admissions = await Database
            .from('ais_admissions')
            .where('OBDOBIE', school_year)
            .where('stupen_studia', 'Bakalársky')
            .getCount()

        if (count_admissions == 0) {
            console.log("chyba ais_admissions")
            return response
                .status(500)
                .send("Pre vybraný rok nie je importovaná tabuľka ais_admissions")
        }

        //kontrola vsetkych potrebnych tabuliek
        const tables = await Database
            .select('used_tables')
            .from('prediction_models')
            .where('id', model_id)

        console.log(tables[0].used_tables)
        let used_tables = tables[0].used_tables.split(',')

        for (var i = 0; i < used_tables.length; i++) {
            const table = used_tables[i]
            let count = await Database
                .from(table)
                .getCount()

            if (count == 0) {
                console.log("chyba v " + table)
                return response
                    .status(500)
                    .send("Pre vybraný rok nie je importovaná tabuľka" + table)
            }
        }

        response.implicitEnd = false

        var request = require('request')

        let request_string = "http://localhost:5000/prediction?school_year=" + school_year + "&model=" + model_id;

        function request_prediction() {
            return new Promise(function (fulfill, reject) {
                request.get(request_string, function (error, response, body) {
                    
                    if (!error && response.statusCode == 200) {
                        fulfill(body);
                    }
                    else {
                        reject(error, response)
                    }
                });
            });
        }

        request_prediction().then(
            async function (result) {
                console.log("uspech v then");
                const pole_ais_id = result.split(',')
                const data = []

                for (var i = 0; i < pole_ais_id.length; i++) {
                    let student = await Database.select('AIS_ID', 'Meno', 'Priezvisko', 'Body', 'Body_celkom', 'Prijatie_na_program_1', 'Stredná_škola_1', 'Stredná_škola_adresa', 'Trv_pobyt_obec')
                        .from('ais_admissions')
                        .where('AIS_ID', pole_ais_id[i])
                    
        
                    data.push(student[0])
                }
                
                response.send(data);
            },
            function (error) {
                console.log("error v then");
                if (error.code == 'ECONNREFUSED') {
                    return response.status(505).send("Skontrolujte, či máte spustený Flask")
                }
                return response.status(505).send("Chyba v Pythone")
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

    async get_models({ request, response }) {
        const request_params = await request.all()
        let subject = request_params.subject
        let data

        if (subject == 'Celková predikcia') {
            data = await Database
                .select('prediction_models.id', 'prediction_models.name')
                .from('prediction_models')
                .where('prediction_models.type', 'komplex')
        }

        else {
            data = await Database
                .select('prediction_models.id', 'prediction_models.name')
                .from('prediction_models')
                .join('ais_subjects', 'subject_id', 'ais_subjects.id')
                .where('ais_subjects.PREDMET', request_params.subject)
        }
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
            .select('prediction_models.id', 'name', 'type', 'PREDMET', 'used_years', 'used_tables', 'size_of_training_set', 'accuracy', 'f1', 'precision', 'recall', 'best_feature_1_name', 'best_feature_1_importance',  'best_feature_2_name', 'best_feature_2_importance',  'best_feature_3_name', 'best_feature_3_importance',  'best_feature_4_name', 'best_feature_4_importance',  'best_feature_5_name', 'best_feature_5_importance')
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

        let mock_data = ['Matematická analýza', 'Algebra a diskrétna matematika', 'Procedurálne programovanie', 'Metódy inžinierskej práce']
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

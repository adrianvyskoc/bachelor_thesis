'use strict'

const Student = use('App/Models/Student')

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
        /*
        const zadane_meno = await request.all()
        console.log("som v indexe2")
        const odpoved = "z backendu" + zadane_meno.meno
        return response.send( {
            odpoved
        })
        v route je
        Route.get('predictions', 'PredictionController.index')

        a v http requeste potom http://localhost:3333/api/predictions?meno=magdik
        */
      //  const odpoved = "meeheh"
        //return response.send({odpoved})

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



       
}

module.exports = PredictionController

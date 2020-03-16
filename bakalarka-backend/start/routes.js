'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {import('@adonisjs/framework/src/Route/Manager'} */
const Route = use('Route')

Route
    .group(() => {

        // import ais
        Route.post('import/ais/:selectedImport', 'ImportAisController.import')

        // import ineko
        Route.post('import/ineko/:selectedImport', 'ImportInekoController.import')

        // api endpoints

        Route.get('students', 'StudentController.getStudents')

        Route.get('getGrades/:year', 'GetController.getGrades')
        Route.get('getSchools', 'GetController.getSchools')
        Route.get('getSubjects/:year', 'GetController.getSubjects')

        /*
          Admissions api endpoints start
         */
        Route.get('getAdmission/:id', 'AdmissionController.getAdmission')
        Route.get('getAdmissions/:year', 'AdmissionController.getAdmissions')
        Route.put('admissions/:id/update', 'AdmissionController.updateAdmission')
        Route.delete('admissions/:id/delete', 'AdmissionController.deleteAdmission')
        Route.delete('admissions/delete/all', 'AdmissionController.deleteAllAdmissions')
        Route.delete('admissions/delete/:year', 'AdmissionController.deleteAdmissionsForGivenYear')
        Route.delete('admissions/delete/:year/:inekoData', 'AdmissionController.deleteInekoDataForGivenYear')
        Route.put('admissions/changeYear', 'AdmissionController.changeYearForGivenYear')
        Route.put('admissions/changeYearForInekoData', 'AdmissionController.changeYearForInekoData')
        Route.get('admissionsBySurname', 'AdmissionController.getAdmissionsBySurname')

        /*
          Admissions api endpoints end
         */

        /*
          Students api endpoints start
         */

        Route.get('student/:id', 'StudentController.getStudent')

        /*
          Students api endpoints end
         */

        /*
          Administrators api endpoints start
        */
        Route.get('administrators', 'GetController.getUsers')  // getAllAccounts
        Route.post('administrators/addUser', 'GetController.addUser')
        Route.post('administrators/addAdmin', 'GetController.addAdmin')
        Route.post('administrators/removeAdmin', 'GetController.removeAdmin')
        Route.post('administrators/removeUser', 'GetController.removeUser')
        /*
          Administrators api endpoints end
        */

       /*
          State Final Exams BC and ING api endpoints start
       */
        Route.post('statefinalexamsbc', 'getController.getStateFinalExamsBc')
        Route.post('statefinalexamsbc/update', 'getController.updateStateFinalExamsBc')
        Route.post('statefinalexamsbc/delete', 'getController.deleteStateFinalExamsBc')
        Route.get('statefinalexamsbc/year', 'getController.getDateYears')
        Route.get('finalexamconfig/get', 'GetController.getFinalExamConfiguration')
        Route.post('finalexamconfig/update', 'GetController.updateFinalExamConfiguration')

        Route.post('statefinalexamsing', 'getController.getStateFinalExamsIng')
        Route.post('statefinalexamsing/update', 'getController.updateStateFinalExamsIng')
        Route.post('statefinalexamsing/delete', 'getController.deleteStateFinalExamsIng')
        Route.get('statefinalexamsing/year', 'getController.getDateYearsIng')
        Route.get('finalexamconfiging/get', 'GetController.getFinalExamConfigurationIng')
        Route.post('finalexamconfiging/update', 'GetController.updateFinalExamConfigurationIng')
        /*
          api endpoints end
        */

        /*
          Statistics api endpoints start
        */
        Route.post('statistics', 'getController.getStatistics')
        Route.get('statistics/year', 'getController.getDateYearsStart')
        Route.get('statistics/yearForDelete', 'getController.getDateYearsForDelete')
        Route.post('statistics/delete', 'getController.deleteStatistics')
        /*
          api endpoints end
        */

        /*
          Login LDAP
        */
        //Route.post('login', 'UserController.loginWithLDAP') //originalny LDAP funkcny
        Route.post('login', 'UserController.verifyEmail') // už aj s overením prístupu

        /*
          Feature routes
        */

        // Admissions overview
        Route.get('admissionsOverview', 'AdmissionController.getAdmissionsOverview')

        // Admissions year comparison
        Route.get('admissionsYearComparison', 'GetController.getAdmissionsYearComparison')

        // Admissions bachelor
        Route.get('admissionsBachelor', 'GetController.getAdmissionsBachelor')

        // Admissions master
        Route.get('admissionsMaster', 'GetController.getAdmissionsMaster')

        // Get attributes for table
        Route.get('tableColumns', 'GetController.getAttrNames')

        // 
        Route.get('predictions', 'PredictionController.index')

        Route.get('predictions/predict', 'PredictionController.predict')

    })
    .prefix('/api')

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

        // import codebooks
        Route.post('codebook/:type', 'SettingController.createCodebookRecord')

        // api endpoints
        Route.get('getStudents/:year', 'GetController.getStudents')
        Route.get('getAttendance/:year', 'GetController.getAttendance')
        Route.get('getGrades/:year', 'GetController.getGrades')
        Route.get('getSchools', 'GetController.getSchools')
        Route.get('getSubjects/:year', 'GetController.getSubjects')
        Route.get('codebook/:type', 'GetController.getCodebook')
        Route.get('column-meaning/:type', 'GetController.getColumnMeaning')


        /*
          Admissions api endpoints start
         */

        Route.get('getAdmission/:id', 'GetController.getAdmission')
        Route.get('getAdmissions/:year', 'GetController.getAdmissions')
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
          Administrators api endpoints start
        */
        Route.get('administrators', 'GetController.getUsers')  // getAllAccounts
        Route.post('administrators/addUser', 'GetController.addUser')
        Route.post('administrators/addAdmin', 'GetController.addAdmin')
        Route.post('administrators/removeAdmin', 'GetController.removeAdmin')
        Route.post('administrators/removeUser', 'GetController.removeUser')
        // Route.get('administrators/getIfIsAdmin/:user', 'GetController.getIfIsAdmin')
        /*
          Administrators api endpoints end
        */

        Route.get('finalexamconfig/get', 'GetController.getFinalExamConfiguration')
        Route.post('finalexamconfig/update', 'GetController.updateFinalExamConfiguration')

        /*
          State Final Exams api endpoints start
        */
        Route.get('statefinalexamsbc', 'getController.getStateFinalExamsBc')
        Route.post('statefinalexamsbc/update', 'getController.updateStateFinalExamsBc')
        
        Route.get('statefinalexamsing', 'getController.getStateFinalExamsIng')
        Route.post('statefinalexamsing/update', 'getController.updateStateFinalExamsIng')
        /*
          State Final Exams api endpoints end
        */


        /*
          Login LDAP
        */
        //Route.post('login', 'UserController.loginWithLDAP') //originalny LDAP funkcny
        Route.post('login', 'UserController.verifyEmail') // už aj s overením prístupu


        // imported years
        Route.get('importedYears', 'GetController.getImportedYears')

        /*
          Feature routes
        */

        // Admissions overview
        Route.get('admissionsOverview', 'GetController.getAdmissionsOverview')

        // Admissions year comparison
        Route.get('admissionsYearComparison', 'GetController.getAdmissionsYearComparison')

        // Admissions bachelor
        Route.get('admissionsBachelor', 'GetController.getAdmissionsBachelor')

        // Admissions master
        Route.get('admissionsMaster', 'GetController.getAdmissionsMaster')

        // Get attributes for table
        Route.get('tableColumns', 'GetController.getAttrNames')
    })
    .prefix('/api')

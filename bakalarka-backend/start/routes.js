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
        // test
        Route.get('test', 'ImportAisController.read')

        // import ais
        Route.post('import/ais/:selectedImport/:year', 'ImportAisController.import')

        // import ineko
        Route.post('import/ineko/:selectedImport/:year', 'ImportInekoController.import')

        // import codebooks
        Route.post('codebook/:type', 'SettingController.createCodebookRecord')

        // api endpoints
        Route.get('getStudents/:year', 'GetController.getStudents')
        Route.get('getAttendance/:year', 'GetController.getAttendance')
        Route.get('getAdmissions/:year', 'GetController.getAdmissions')
        Route.get('getGrades/:year', 'GetController.getGrades')
        Route.get('getSchools', 'GetController.getSchools')
        Route.get('getSubjects/:year', 'GetController.getSubjects')
        Route.get('codebook/:type', 'GetController.getCodebook')
        Route.get('column-meaning/:type', 'GetController.getColumnMeaning')

        Route.get('getAdmission/:id', 'GetController.getAdmission')
    })
    .prefix('/api')

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
        Route.get('test', 'ImportController.read')

        // imports
        Route.post('import/:selectedImport/:selectedAction', 'ImportController.import')
        Route.post('codebook/:type', 'SettingController.createCodebookRecord')

        // api endpoints
        Route.get('getStudents', 'GetController.getStudents')
        Route.get('getAttendance', 'GetController.getAttendance')
        Route.get('getGrades', 'GetController.getGrades')
        Route.get('getSubjects', 'GetController.getSubjects')
        Route.get('codebook/:type', 'GetController.getCodebook')
    })
    .prefix('/api')
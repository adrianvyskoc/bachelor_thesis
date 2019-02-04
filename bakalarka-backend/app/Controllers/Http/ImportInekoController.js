'use strict'

const xlsx = use('xlsx')
const Helpers = use('Helpers')
const Database = use('Database')
const fs = use('fs');

// Models
const AdditionalData = use('App/Models/AdditionalData')
const TotalRating    = use('App/Models/TotalRating')
const Percentil      = use('App/Models/Percentil')
const Pointer        = use('App/Models/Pointer')
const School         = use('App/Models/School')

class ImportInekoController {

    async import ({request, response, params}) {

        const config = {
            //sheetRows: 11,
            type: "string",
            cellFormula: false,		// formula format
            cellHTML: false,		// html formats
            cellText: false			// formatted text format
        }

        // upload a file
        const xlsxFile = request.file(params.selectedImport)

        await xlsxFile.move(Helpers.tmpPath('uploads'), {
            name: params.selectedImport + '.xlsx'
        })
        if (!xlsxFile.moved()) {
            return xlsxFile.error()
        }

        // excel
        const workbook = xlsx.readFile(`tmp/uploads/${params.selectedImport}.xlsx`, config)
        const sheet_name_list = workbook.SheetNames
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])

/*
 *  import rows start ------------------------------------------------------------------------------------------
 */

        // pole názvov atribútov, ktoré môžeme vymazať vo všetkých tabuĽkách okrem zoznamu škôl
        const toDeleteAttrs = [ 'kraj', 'okres', 'zriadovatel', 'druh_skoly', 'jazyk', 'typ_skoly', 'nazov', 'ulica', 'obec', 'PSC' ]

        // errory, ktoré vrátime frontendu
        let emptySchoolFK = [];

        // -------------------------------------------------------------------
        // Schools
        // -------------------------------------------------------------------

        if(params.selectedImport == 'Schools') {
            for (let row of rows) {
                if(row.typ_skoly == "Špeciálna základná škola" ||
                   row.typ_skoly == "Základná škola" ||
                   row.typ_skoly == "Základná umelecká škola") continue

                for (const prop of Object.keys(row)) {
                    if(prop.indexOf('__EMPTY') > -1) delete row[prop];
                }

                delete row['ID']
                let school = new School()
                school.fill(row)

                try {
                    await school.save()
                } catch(err) {
                    console.log(err)
                }
            }
        }

        // -------------------------------------------------------------------
        // Percentils, TotalRating, AdditionalData, Pointers
        // -------------------------------------------------------------------

        else {
            for(let row of rows) {
                if(row.typ_skoly == "Špeciálna základná škola" ||
                    row.typ_skoly == "Základná škola" ||
                    row.typ_skoly == "Základná umelecká škola") continue

                let school = []
                if(row.ulica && row.typ_skoly) {
                    school = await Database.from("ineko_schools")
                        .where("typ_skoly", row.typ_skoly)
                        .where("ulica", row.ulica)
                }

                if(school.length) {
                    row.school_id = school[0].kod_kodsko
                } else {
                    row.school_id = null
                    emptySchoolFK.push(row.nazov)
                }

                row.OBDOBIE = params.year
                row.typ = "KONCOROCNE"

                for(const prop of toDeleteAttrs) {
                    delete row[prop]
                }

                let record
                switch (params.selectedImport) {
                    case 'Percentils':
                        record = new Percentil()
                        break;

                    case 'TotalRating':
                        record = new TotalRating()
                        break

                    case 'AdditionalData':
                        record = new AdditionalData()
                        break

                    case 'Pointers':
                        record = new Pointer()
                        break

                    default:
                        break
                }
                record.fill(row)

                try {
                    await record.save()
                } catch(err) { console.log(err) }
            }
        }

/*
 *  import rows end ------------------------------------------------------------------------------------------
 */

        // delete uploaded xlsx file
        deleteFile(Helpers.tmpPath('uploads'), params.selectedImport);

        return response.send(emptySchoolFK);
    }

}


function deleteFile(path, selectedImport) {
    fs.unlink(path + `/${selectedImport}.xlsx`, function(err) {
        if(err) console.log(err)
    })
}

function adjustKeys(obj) {
    let newObj = {}
    for (let key in obj) {
        let newKey = key.split(".").join("").split(" ").join("_").split("-").join("_").replace(/_+/g, '_');
        newObj[newKey] = obj[key]
    }

    return newObj;
}


module.exports = ImportInekoController

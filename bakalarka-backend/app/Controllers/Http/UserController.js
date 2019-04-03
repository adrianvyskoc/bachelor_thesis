'use strict'

const ldap = require('ldapjs');
const Admin = use('App/Models/Admin')


class UserController {

  async verifyEmail({ request, response }) {
    const email = request.body.email
    let auth = {
      access: false,
      admin: false
    }

    const user = await Admin
      .query()
      .where({
        'email': email,
      })

    user[0].access ? auth.access = true : null
    if (user !== undefined && auth.access) {
      if (await this.loginWithLDAP({ request, response })) {
        user[0].admin ? auth.admin = true : null
      }
    } else {
      console.log('pouzivatel nie je v databaze')
    }
    return response.send(auth)
  }

  async loginWithLDAP({ request, response }) {
    return new Promise((resolve, reject) => {
      let data = request.all()
      let loggedIn = false
      // console.log(`pouzivatel: ${data.email} sa skusil prihlasit s ${data.password}`)

      // ************************************ start JavaScript LDAP
      if (data.email && data.password) {
        const client = ldap.createClient({
          url: 'ldaps://ldap.stuba.sk'
        });

        client.on('error', function (error) {
          console.log("Nepodarilo sa prihlasit na stuba LDAP server!");
          process.exit();
        })

        client.bind(`uid=${data.email}, ou=People, DC=stuba, DC=sk`, `${data.password}`, function (err) {
          err ? resolve(false) : resolve(true)
        })
      } else {
        console.log("Musis zadat meno a heslo $ node ldap_validator meno heslo");
      }
    })
    .then((res) => {
      return res
      // console.log(res)
      // return response.status(200).send(res)
    })
    // ************************************
  }
}

module.exports = UserController

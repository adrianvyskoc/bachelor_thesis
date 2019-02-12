'use strict'

const ldap = require('ldapjs');

class UserController {

  async loginWithLDAP({
    request,
    response
  }) {
    return new Promise((resolve, reject) => {
      let data = request.all()
      let loggedIn = false
      console.log(`pouzivatel: ${data.email} sa skusil prihlasit s ${data.password}`)

      // ************************************ start JavaScript LDAP
      if (data.email != null && data.password != null) {
        const client = ldap.createClient({
          url: 'ldaps://ldap.stuba.sk'
        });

        client.on('error', function (error) {
          console.log("Nepodarilo sa prihlasit na stuba LDAP server!");
          process.exit();
        })

        client.bind(`uid=${data.email}, ou=People, DC=stuba, DC=sk`, `${data.password}`, function (err) {
          if (err == null) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      } else {
        console.log("Musis zadat meno a heslo $ node ldap_validator meno heslo");
      }
    })
    .then((res) => {
      console.log(res)
      return response.send(res)
    })
    // ************************************
  }
}

module.exports = UserController

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

    console.log(user)
    if(user == undefined || user.length === 0) {
      return response.send({
        type: 'error',
        message: 'Použivateľ v systéme neexistuje'
      });
    } else {
      user[0].access ? auth.access = true : null
      if (auth.access) {
        if (await this.loginWithLDAP({ request, response })) {
          user[0].admin ? auth.admin = true : null
          // if (auth.admin) {
            return response.send({
              type: 'success',
              message: 'Prihlásenie úspešné',
              auth: auth
            });
          // } else {
          //   return response.send({
          //     type: 'error',
          //     message: 'Nie ste pripojeny na univerzitnu siet',
          //     auth: auth
          //   });
          // }
        } else {
          return response.send({
            type: 'error',
            message: 'Nesprávne meno alebo heslo',
            auth: auth
          });
        }
      } else {
        return response.send({
          type: 'error',
          message: 'Používateľ nemá oprávnenie na prístup',
          auth: auth
        });
      }
    }
  }

  async loginWithLDAP({ request, response }) {
    return new Promise((resolve, reject) => {
      let data = request.all()

      if (data.email && data.password) {
        const client = ldap.createClient({
          url: 'ldaps://ldap.stuba.sk'
        });

        client.on('error', function (error) {
          console.log("Nepodarilo sa prihlasit na stuba LDAP server!");
          process.exit();
        })

        client.bind(`uid=${data.email}, ou=People, DC=stuba, DC=sk`, `${data.password}`, function (err, lol) {
          console.log(lol)
          err ? resolve(false) : resolve(true)
        })
      } else {
        resolve(false)
      }
    })
    .then((res) => {
      return res
    })
  }
}

module.exports = UserController

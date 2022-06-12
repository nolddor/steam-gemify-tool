const Bot = require('../classes/Bot')


Bot.prototype.getPersona = function(steamid) {

    let persona = this.client.users[steamid]

    if(persona) {
        return Promise.resolve(persona)
    }

    return this.client.getPersonas([steamid]).then( response =>
        response.personas[steamid]
    )
}

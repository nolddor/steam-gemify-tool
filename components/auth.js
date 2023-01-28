const Tool = require('../classes/Tool')
const Duration = require('../classes/Duration')
const totp = require("steam-totp")
const logger = require('../classes/Logger')


Tool.prototype.logOn = function() {
    logger.info('Connecting to Steam services...', {component: 'Auth'})
    this.community.login({
        "accountName": this.config.username,
        "password": this.config.password,
        "twoFactorCode": this.getSteamGuardCode(),
        "disableMobile": true,
    }, (error, sessionID, cookies, steamguard, oAuthToken) => {

        if(error) {
            this.emit('error', error)
        }
        else {
            this.emit('loggedOn', {
                "sessionID" : sessionID,
                "cookies" : cookies,
                "steamguard" : steamguard,
                "oAuthToken" : oAuthToken
            })
        }

    })
}


Tool.prototype.onLoggedOn = function(details) {
    logger.info(`Logged as ${this.config.username} (${this.community.steamID.getSteamID64()}) successfully.`, {component: 'Auth'})
    this.inventory.loadInventories()
}


Tool.prototype.getSteamGuardCode = function() {
    return totp.getAuthCode(this.config.shared_secret)
}


Tool.prototype.onWebSessionExpired = function(error) {
    logger.debug('The steamcommunity.com web session has expired. Re-connecting...', {component: 'Auth'})
}

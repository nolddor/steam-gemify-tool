const Bot = require('../classes/Bot')
const logger = require('../classes/Logger')
const { askSteamGuardMobileCode } = require('../classes/Inquirer')

Bot.prototype.logOn = function (accountName, password, twoFactorCode) {
  this.community.login({
    accountName,
    password,
    twoFactorCode,
    disableMobile: true,
  }, async (error, sessionID, cookies, steamguard, oAuthToken) => {
    if (error?.message === 'SteamGuardMobile') {
      logger.warn('Missing or Invalid SteamGuard Mobile Code!', { component: 'Auth' })
      const code = (await askSteamGuardMobileCode()).code
      this.logOn(accountName, password, code)
    } else if (error) {
      this.emit('error', error)
    } else {
      this.emit('loggedOn', {
        sessionID,
        cookies,
        steamguard,
        oAuthToken,
      })
    }
  })
}

Bot.prototype.onLoggedOn = function (details) {
  logger.info(`Logged as ${this.config.username} (${this.community.steamID.getSteamID64()}) successfully.`, { component: 'Auth' })
}

Bot.prototype.onceLoggedOn = function (details) {
  this.inventory.loadInventories()
}

Bot.prototype.onWebSessionExpired = function () {
  logger.debug('The steamcommunity.com web session has expired. Re-connecting...', { component: 'Auth' })
  this.logOn(this.config.username, this.config.password)
}

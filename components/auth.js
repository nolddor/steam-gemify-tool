const Bot = require('../classes/Bot')
const Duration = require('../classes/Duration')
const totp = require("steam-totp")
const logger = require('../classes/Logger')


Bot.prototype.logOn = function() {
    logger.info('Connecting to Steam services...', {component: 'Auth'})
    this.client.logOn({
        "accountName": this.config.username,
        "password": this.config.password,
        /**
         * By default Steam client derives this from our machine's private IP
         * If you try to logon twice to the same account from the same public IP with the same logonID,
         * the first session will be kicked with reason SteamUser.EResult.LogonSessionReplaced.
         * See https://dev.doctormckay.com/topic/2553-how-to-fix-error-logonsessionreplaced/
         */
        "twoFactorCode": this.getSteamGuardCode(),
        "logonID": '127.0.0.1',
        rememberPassword: true,
    })
}


Bot.prototype.onLoggedOn = function(details, parental) {

    let steamid = this.client.steamID

    this.getPersona(steamid).then(persona => {
        logger.info(`Logged as ${persona.player_name || '?'} (${steamid}) successfully.`, {component: 'Auth'})
    }, error => {
        logger.info(`Logged as #${steamid} successfully.`, {component: 'Auth'})
    })
}


Bot.prototype.getSteamGuardCode = function() {
    return totp.getAuthCode(this.config.shared_secret)
}


Bot.prototype.onSteamGuard = function(domain, callback, lastCodeWrong) {
    if (lastCodeWrong) {
        logger.warn("Generated Steam Guard Code has been previously used or wrong. Retrying in 30 seconds...", {component: 'Auth'})
        /**
         * We should add a delay before to attempt to relog if last code was wrong.
         * A wrong code will continue being wrong for up to 30 seconds.
         * See https://dev.doctormckay.com/topic/497-rate-limit-exceeded/
         * ----------------
         * Moreover, 'SteamGuard' event seems to be thrown more than once under some rare circumstance (network issues mostly),
         * so it's a good idea to ensure just one timmer exists per 30seg to avoid dupe calls on next retry.
         */
        setTimeout(() => {
            callback(this.getSteamGuardCode())
        }, +Duration.ofSeconds(30)) // Needed to avoid RateLimitExceeded Errors
    } else {
        callback(this.getSteamGuardCode())
    }
}


Bot.prototype.onWebLogOn = function(sessionID, cookies) {
    logger.debug("A steamcommunity.com web session has been successfully negotiated.", {component: 'Auth'})
    this.setCookies(cookies)
}


Bot.prototype.onceWebLogOn = function(sessionID, cookies) {
    this.inventory.loadInventories()
}


Bot.prototype.onWebSessionExpired = function(error) {
    /*
     * We cannot log onto steamcommunity.com without first being connected to Steam network,
     * If we are not connected to Steam network, then client.steamID is not set
     * Further info at https://dev.doctormckay.com/topic/2213-cannot-log-onto-steamcommunitycom-without-first-being-connected-to-steam-network/?tab=comments#comment-7292
     */
    if (this.client.steamID) {
        logger.debug('The steamcommunity.com web session has expired. Re-connecting...', {component: 'Auth'})
        this.client.webLogOn()
    }
}


Bot.prototype.setCookies = function(cookies) {
    this.community.setCookies(cookies)
    logger.debug(`Cookies on SteamCommunity object have been updated.`, {component: 'Auth'})
}


Bot.prototype.onDisconnected = function(eresult, msg) {
    logger.warn(`Disconnected from Steam! Reconnecting...\n  > Reason: ${msg || '-'}, Code: ${eresult || '-'}`,  {component: 'Auth'})
}

const AppDirectory = require('./AppDirectory')
const BotInventory = require('./BotInventory')
const SteamUser = require('steam-user')
const SteamCommunity = require('steamcommunity')
const path = require('path')


class Bot {

    constructor(config) {
        this.created_at = new Date()
        this.config = config
        this.client = new SteamUser({
            "dataDirectory": path.join(AppDirectory.cache(), 'steam-user'),
        })
        this.chat = this.client.chat
        this.community = new SteamCommunity()
        this.inventory = new BotInventory(this.client, this.community)

        // Event bindings
        this.client.on('loggedOn', (...args) => this.onLoggedOn(...args))
        this.client.on('steamGuard', (...args) => this.onSteamGuard(...args))
        this.client.on('webSession', (...args) => this.onWebLogOn(...args))
        this.client.on('disconnected', (...args) => this.onDisconnected(...args))
        this.community.on('sessionExpired', (...args) => this.onWebSessionExpired(...args))
        this.inventory.on('inventoryLoaded', (...args) => this.onInventoryLoaded(...args))
        this.client.on('error', (...args) => this.onError(...args))

        this.client.once('webSession', (...args) => this.onceWebLogOn(...args))
    }

}


module.exports = Bot
// Require all the components that add their own methods to the Bot class' prototype
require('../components')

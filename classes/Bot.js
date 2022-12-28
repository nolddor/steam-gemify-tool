const AppDirectory = require('./AppDirectory')
const BotInventory = require('./BotInventory')
const SteamCommunity = require('steamcommunity')
const EventEmitter = require('events')


class Bot extends EventEmitter{

    constructor(config) {
        super()

        this.created_at = new Date()
        this.config = config

        this.community = new SteamCommunity()
        this.inventory = new BotInventory(this.community)

        // Event bindings
        this.on('loggedOn', (...args) => this.onLoggedOn(...args))
        this.community.on('sessionExpired', (...args) => this.onWebSessionExpired(...args))
        this.inventory.on('inventoryLoaded', (...args) => this.onInventoryLoaded(...args))
        this.on('error', (...args) => this.onError(...args))
    }

    run() {
        this.logOn()
    }

}


module.exports = Bot
// Require all the components that add their own methods to the Bot class' prototype
require('../components')

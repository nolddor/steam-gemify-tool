const AppDirectory = require('./AppDirectory')
const BotInventory = require('./BotInventory')
const SteamCommunity = require('steamcommunity')
const EventEmitter = require('events')
const logger = require('./Logger')


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

        // Pre-checks
        if(!this.config.username || !this.config.password || !this.config.shared_secret) {
          logger.error('Verify your config/settings.js file.\n > Fields username, password and shared_secret are required.', {component: 'Tool'})
          process.exit(1)
        }
    }

    run() {
        this.logOn()
    }

}


module.exports = Bot
// Require all the components that add their own methods to the Bot class' prototype
require('../components')

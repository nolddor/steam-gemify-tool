const EventEmitter = require('events')
const Spinner = require('cli-spinner').Spinner
const SteamInventory = require('./SteamInventory')
const Formatter = require('./Formatter')
const ItemUtils = require('./ItemUtils')
const Duration = require('./Duration')
const logger = require('./Logger')


class BotInventory extends EventEmitter {

    constructor(client, community) {
        super()

        this.community = community
        this.client = client

        // Steam Community Tab
        this.bgAssets = []
        this.emoteAssets = []
    }

    loadInventories(retries = 5) {

        logger.info(`Loading Steam Community inventory. Please, wait...`, {component: 'Inventory'})

        let spinner = new Spinner(' > processing... %s')
        spinner.setSpinnerDelay(75)
        spinner.start()

        let loading = this.loadSteamInventory()

        Promise.all([loading])
            .then(([items]) => {

                // Steam Community Tab
                let allEmoteAssets = items.filter(ItemUtils.isEmoticon)
                let allEmoteQty = allEmoteAssets.reduce((total, item) => total + (item.amount || 1), 0)
                let allBgAssets = items.filter(ItemUtils.isProfileBackground)
                let allBgQty = allBgAssets.reduce((total, item) => total + (item.amount || 1), 0)

                let groupByHashName = ( assets = [] ) => {
                    let obj = {}

                    assets.forEach( asset => {
                        let name = asset.market_hash_name

                        obj[name] = obj[name] || []
                        obj[name].push(asset)
                    })

                    return obj
                }

                this.emoteAssets = groupByHashName(allEmoteAssets)
                let emoteHashQty = Object.keys(this.emoteAssets).length
                this.bgAssets = groupByHashName(allBgAssets)
                let bgHashQty = Object.keys(this.bgAssets).length

                spinner.stop()
                console.log()

                logger.info(` > Found ${Formatter.format(allEmoteQty)} emoticons in total.`, {component: 'Inventory'})
                logger.info(` > Found ${Formatter.format(emoteHashQty)} unique emoticons.`, {component: 'Inventory'})
                logger.info(` >`, {component: 'Inventory'})
                logger.info(` > Found ${Formatter.format(allBgQty)} backgrounds in total.`, {component: 'Inventory'})
                logger.info(` > Found ${Formatter.format(bgHashQty)} unique backgrounds.`, {component: 'Inventory'})
                this.emit('inventoryLoaded', {})

            }, error => {
                spinner.stop()
                console.log()

                if(!retries) {
                    logger.error(`Unable to retrieve bot's inventory after (5) attemps!. Skipping...\n  > Reason: ${error.message || '-'}, Code: ${error.eresult || '-'}`, {component: 'Inventory'})
                    return
                }

                logger.warn(`Unable to retrieve bot's inventory content. Retrying in 15 seconds...\n  > Reason: ${error.message || '-'}, Code: ${error.eresult || '-'}`, {component: 'Inventory'})
                setTimeout(() => {
                    this.loadInventories(--retries)
                }, +Duration.ofSeconds(15))
            })
    }

    loadSteamInventory() {
        return this.loadInventory(SteamInventory.STEAM_COMMUNITY)
    }


    loadInventory(inventory) {
        return new Promise((resolve, reject) => {
            this.community.getUserInventoryContents(this.community.steamID, inventory.appid, inventory.contextid, true, (error, items) => {
                if (!error) {
                    resolve(items)
                } else {
                    reject(error)
                }
            })
        })
    }

}


module.exports = BotInventory

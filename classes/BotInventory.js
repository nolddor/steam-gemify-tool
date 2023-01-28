const EventEmitter = require('events')
const Spinner = require('cli-spinner').Spinner
const SteamInventories = require('./SteamInventories')
const Formatter = require('./Formatter')
const ItemUtils = require('./ItemUtils')
const Duration = require('./Duration')
const logger = require('./Logger')

class BotInventory extends EventEmitter {
    constructor(community) {
        super()

        this.community = community

        // Steam Community Tab
        this.bgAssets = []
        this.emoteAssets = []
    }

    loadInventories(retries = 5) {
        logger.info('Loading Steam Community inventory. Please, wait...', { component: 'Inventory' })

        const spinner = new Spinner(' > processing... %s')
        spinner.setSpinnerDelay(75)
        spinner.start()

        const loading = this.loadSteamInventory()

        Promise.all([loading])
            .then(([items]) => {
                // Steam Community Tab
                const allEmoteAssets = items.filter(ItemUtils.isEmoticon)
                const allEmoteQty = allEmoteAssets.reduce((total, item) => total + (item.amount || 1), 0)
                const allBgAssets = items.filter(ItemUtils.isProfileBackground)
                const allBgQty = allBgAssets.reduce((total, item) => total + (item.amount || 1), 0)

                const groupByHashName = (assets = []) => {
                    const obj = {}

                    assets.forEach(asset => {
                        const name = asset.market_hash_name

                        obj[name] = obj[name] || []
                        obj[name].push(asset)
                    })

                    return obj
                }

                this.emoteAssets = groupByHashName(allEmoteAssets)
                const emoteHashQty = Object.keys(this.emoteAssets).length
                this.bgAssets = groupByHashName(allBgAssets)
                const bgHashQty = Object.keys(this.bgAssets).length

                spinner.stop()
                console.log()

                logger.info(` > Found ${Formatter.format(allEmoteQty)} emoticons in total.`, { component: 'Inventory' })
                logger.info(` > Found ${Formatter.format(emoteHashQty)} unique emoticons.`, { component: 'Inventory' })
                logger.info(' >', { component: 'Inventory' })
                logger.info(` > Found ${Formatter.format(allBgQty)} backgrounds in total.`, { component: 'Inventory' })
                logger.info(` > Found ${Formatter.format(bgHashQty)} unique backgrounds.`, { component: 'Inventory' })
                this.emit('inventoryLoaded', {})
            }, error => {
                spinner.stop()
                console.log()

                if (!retries) {
                    logger.error(`Unable to retrieve inventory content after (5) attemps!. Skipping...\n  > Reason: ${error.message || '-'}, Code: ${error.eresult || '-'}`, { component: 'Inventory' })
                    return
                }

                logger.warn(`Unable to retrieve inventory content. Retrying in 15 seconds...\n  > Reason: ${error.message || '-'}, Code: ${error.eresult || '-'}`, { component: 'Inventory' })
                setTimeout(() => {
                    this.loadInventories(--retries)
                }, +Duration.ofSeconds(15))
            })
    }

    loadSteamInventory() {
        return this.loadInventory(SteamInventories.STEAM_COMMUNITY)
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

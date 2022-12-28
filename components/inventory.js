const Bot = require('../classes/Bot')
const Formatter = require('../classes/Formatter')
const Spinner = require('cli-spinner').Spinner
const logger = require('../classes/Logger')
const inquirer = require('inquirer')


Bot.prototype.onInventoryLoaded = function() {

    logger.info(`Starting 'Gemify' process with the following settings:`, {component: 'Tool'})
    logger.info(` * Keep up to ${Formatter.format(this.config.MAX_STOCK)} copies per item.`, {component: 'Tool'})
    logger.info(` * Emoticons: ${this.config.gemify_emote ? 'grind into gems' : 'do nothing'}.`, {component: 'Tool'})
    logger.info(` * Backgrounds: ${this.config.gemify_bg ? 'grind into gems' : 'do nothing'}.`, {component: 'Tool'})
    logger.info(`Searching for overstocked items. Please, wait...`, {component: 'Tool'})

    let sliceExcess = ( byHashObj = {}, maxQty = 0 ) => {
        let obj = []

        Object.keys(byHashObj).forEach( hash => {
            let dupeQty = byHashObj[hash].length

            if(dupeQty > maxQty) {
                let excess = byHashObj[hash].slice(0, (dupeQty-maxQty))
                obj.push(...excess)
            }
        })

        return obj
    }

    let toGems = []

    if(this.config.gemify_emote) {
        toGems.push(...sliceExcess(this.inventory.emoteAssets, this.config.MAX_STOCK))
    }

    if(this.config.gemify_bg) {
        toGems.push(...sliceExcess(this.inventory.bgAssets, this.config.MAX_STOCK))
    }

    let toGemsQty = toGems.length
    logger.info(` > Found ${Formatter.format(toGemsQty)} items to grind into gems.`, {component: 'Tool'})

    inquirer.prompt([{
      name: 'confirm',
      type: 'confirm',
      message: 'Do you want to continue? This action cannot be undone.'
  }]).then(answers => {
      if(answers.confirm) {
          this.grindItemsIntoGems(toGems)
      } else {
          process.exit(0)
      }
  })

}


Bot.prototype.grindItemsIntoGems = async function(assets = []) {

    let spinner = new Spinner(` > [0/${assets.length}] gemifiying... %s`)
    spinner.setSpinnerDelay(75)
    spinner.start()

    let gems_count = 0
    let fail_count = 0
    let success_count = 0

     for (const [index, item] of assets.entries()) {
        try {
            spinner.text = ` > [${index}/${assets.length}] gemifiying... %s`

            let getGemValue = await this.getGemValue(item.market_fee_app, item.assetid)
            let turnItemIntoGems = await this.turnItemIntoGems(item.market_fee_app, item.assetid, getGemValue.gemValue)

            gems_count += turnItemIntoGems.gemsReceived
            success_count++
        } catch (e) {
            console.log()
            logger.error(`${e}`, {component: 'Tool'})
            fail_count++
        }
    }

    spinner.stop()
    console.log()

    logger.info(`Process 'Gemify' has finished.`, {component: 'Tool'})
    if(success_count) {
        logger.info(`Your items (${Formatter.format(success_count)}) have been Gemified! You've gained ${Formatter.format(gems_count)} gems.`, {component: 'Tool'})
    }
    if(fail_count) {
        logger.warn(`There were some errors. Unable to grind ${Formatter.format(fail_count)} items into gems.`, {component: 'Tool'})
    }

    process.exit(0)
}

const Bot = require('../classes/Bot')
const Formatter = require('../classes/Formatter')
const Spinner = require('cli-spinner').Spinner
const logger = require('../classes/Logger')
const inquirer = require('inquirer')
const { once } = require('node:events')

Bot.prototype.onInventoryLoaded = function () {
  logger.info(`Starting 'Gemify' process with the following settings:`, { component: 'Tool' })
  logger.info(` * Keep up to ${Formatter.format(this.config.MAX_STOCK)} copies per item.`, { component: 'Tool' })
  logger.info(` * Emoticons: ${this.config.gemify_emote ? 'grind into gems' : 'do nothing'}.`, { component: 'Tool' })
  logger.info(` * Backgrounds: ${this.config.gemify_bg ? 'grind into gems' : 'do nothing'}.`, { component: 'Tool' })
  logger.info('Searching for overstocked items. Please, wait...', { component: 'Tool' })

  const sliceExcess = (byHashObj = {}, maxQty = 0) => {
    const obj = []

    Object.keys(byHashObj).forEach(hash => {
      const dupeQty = byHashObj[hash].length

      if (dupeQty > maxQty) {
        const excess = byHashObj[hash].slice(0, (dupeQty - maxQty))
        obj.push(...excess)
      }
    })

    return obj
  }

  const toGems = []

  if (this.config.gemify_emote) {
    // Using spread syntax on Arrray#push() may lead on RangeError: Maximum call stack size exceeded errors if inventory is too large.
    // Using forEach approach instead.
    sliceExcess(this.inventory.emoteAssets, this.config.MAX_STOCK).forEach(asset => {
      toGems.push(asset)
    })
  }

  if (this.config.gemify_bg) {
    // Using spread syntax on Arrray#push() may lead on RangeError: Maximum call stack size exceeded errors if inventory is too large.
    // Using forEach approach instead.
    sliceExcess(this.inventory.bgAssets, this.config.MAX_STOCK).forEach(asset => {
      toGems.push(asset)
    })
  }

  const toGemsQty = toGems.length
  logger.info(` > Found ${Formatter.format(toGemsQty)} items to grind into gems.`, { component: 'Tool' })

  inquirer.prompt([{
    name: 'confirm',
    type: 'confirm',
    message: 'Do you want to continue? This action cannot be undone.',
  }]).then(answers => {
    if (answers.confirm) {
      this.grindItemsIntoGems(toGems)
    } else {
      process.exit(0)
    }
  })
}

Bot.prototype.grindItemsIntoGems = async function (assets = []) {
  const spinner = new Spinner(` > [0/${assets.length}] gemifiying... %s`)
  spinner.setSpinnerDelay(75)
  spinner.start()

  let gemsCount = 0
  let failCount = 0
  let successCount = 0

  for (const [index, item] of assets.entries()) {
    try {
      spinner.text = ` > [${index}/${assets.length}] gemifiying... %s`

      const getGemValue = await this.getGemValue(item.market_fee_app, item.assetid)
      const turnItemIntoGems = await this.turnItemIntoGems(item.market_fee_app, item.assetid, getGemValue.gemValue)

      gemsCount += turnItemIntoGems.gemsReceived
      successCount++
    } catch (e) {
      console.log()
      logger.error(`${e}`, { component: 'Tool' })
      failCount++

      if (['NotLoggedOn', 'Not Logged In'].includes(e.message)) {
        this.onWebSessionExpired(e)
        await once(this, 'loggedOn')
      }
    }
  }

  spinner.stop()
  console.log()

  logger.info(`Process 'Gemify' has finished.`, { component: 'Tool' })
  if (successCount) {
    logger.info(`Your items (${Formatter.format(successCount)}) have been Gemified! You've gained ${Formatter.format(gemsCount)} gems.`, { component: 'Tool' })
  }
  if (failCount) {
    logger.warn(`There were some errors. Unable to grind ${Formatter.format(failCount)} items into gems.`, { component: 'Tool' })
  }

  process.exit(0)
}

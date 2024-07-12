const Bot = require('../classes/Bot')
const logger = require('../classes/Logger')

Bot.prototype.onError = function (error) {
  logger.error(error.stack)
  process.exit(1)
}

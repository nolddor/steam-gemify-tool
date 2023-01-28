const Tool = require('../classes/Tool')
const logger = require('../classes/Logger')

Tool.prototype.onError = function(error) {
    logger.error(error.stack)
    process.exit(1)
}

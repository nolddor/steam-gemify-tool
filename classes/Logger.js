const winston = require('winston')
require('winston-daily-rotate-file')
const AppDirectory = require('./AppDirectory')

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss,SSS',
    }),
    winston.format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}] [${info.component || '???'}] ${info.message}`)
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${AppDirectory.logs()}/application/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(info => winston.format.colorize().colorize(info.level, `[${info.timestamp}] [${info.component || ' - '}] ${info.message}`))
      ),
    }),
  ],
})

module.exports = logger

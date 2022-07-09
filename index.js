const Bot = require('./classes/Bot')
const config = require('./config/settings')
const figlet = require('figlet')


console.log(figlet.textSync('Gemify Tool'))

new Bot(config).run()

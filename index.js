const Bot = require('./classes/Bot')
const config = require('./config/settings')
const figlet = require('figlet')

console.log(figlet.textSync('Gemify Tool'))
console.log('')
console.log('> Before to use this tool to gemify your items...')
console.log('> Please, consider to sell them on Colette gems bot.')
console.log('> See https://steamcommunity.com/profiles/76561199096164013')
console.log('')

new Bot(config).run()

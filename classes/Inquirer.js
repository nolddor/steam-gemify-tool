const inquirer = require('inquirer')

const askSteamGuardMobileCode = () => inquirer.prompt([{
  name: 'code',
  type: 'input',
  message: 'Enter your SteamGuard Mobile Code:',
  validate: str => {
    const isValid = str?.length === 5
    return isValid || 'Invalid Code Format!'
  },
}])

module.exports = {
  askSteamGuardMobileCode,
}

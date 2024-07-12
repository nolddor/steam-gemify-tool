const Bot = require('../classes/Bot')

Bot.prototype.getGemValue = function (appid, assetid) {
  return new Promise((resolve, reject) => {
    this.community.getGemValue(appid, assetid, (error, result) => {
      if (error) {
        reject(error)
      }

      resolve(result)
    })
  })
}

Bot.prototype.turnItemIntoGems = function (appid, assetid, expectedGemsValue) {
  return new Promise((resolve, reject) => {
    this.community.turnItemIntoGems(appid, assetid, expectedGemsValue, (error, result) => {
      if (error) {
        reject(error)
      }

      resolve(result)
    })
  })
}

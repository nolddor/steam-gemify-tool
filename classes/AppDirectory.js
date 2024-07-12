const path = require('path')

class AppDirectory {
  static logs () {
    return path.resolve(__dirname, '../logs')
  }

  static cache () {
    return path.resolve(__dirname, '../.cache')
  }

  static data () {
    return path.resolve(__dirname, '../data')
  }

  static config () {
    return path.resolve(__dirname, '../config')
  }
}

module.exports = AppDirectory

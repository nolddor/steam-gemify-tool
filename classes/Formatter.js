class Formatter {
  static format (str) {
    return Number(str).toLocaleString('en-EN')
  }
}

module.exports = Formatter

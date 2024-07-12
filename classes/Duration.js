class Duration {
  constructor (millis) {
    this.millis = millis || 0
  }

  static ofDays (days) {
    const millis = (days || 0) * 24 * 60 * 60 * 1000
    return new Duration(millis)
  }

  static ofHours (hours) {
    const millis = (hours || 0) * 60 * 60 * 1000
    return new Duration(millis)
  }

  static ofMinutes (minutes) {
    const millis = (minutes || 0) * 60 * 1000
    return new Duration(millis)
  }

  static ofSeconds (seconds) {
    const millis = (seconds || 0) * 1000
    return new Duration(millis)
  }

  static ofMillis (millis) {
    return new Duration(millis || 0)
  }

  plusDays (days) {
    this.millis += (days || 0) * 24 * 60 * 60 * 1000
    return this
  }

  plusHours (hours) {
    this.millis += (hours || 0) * 60 * 60 * 1000
    return this
  }

  plusMinutes (minutes) {
    this.millis += (minutes || 0) * 60 * 1000
    return this
  }

  plusSeconds (seconds) {
    this.millis += (seconds || 0) * 100
    return this
  }

  minusDays (days) {
    this.millis -= (days || 0) * 24 * 60 * 60 * 1000
    return this
  }

  minusHours (hours) {
    this.millis -= (hours || 0) * 60 * 60 * 1000
    return this
  }

  minusMinutes (minutes) {
    this.millis -= (minutes || 0) * 60 * 1000
    return this
  }

  minusSeconds (seconds) {
    this.millis -= (seconds || 0) * 1000
    return this
  }

  toMillis () {
    return this.millis
  }

  toSeconds () {
    return this.millis / 1000
  }

  toMinutes () {
    return this.millis / (1000 * 60)
  }

  valueOf () {
    return this.toMillis()
  }
}

module.exports = Duration

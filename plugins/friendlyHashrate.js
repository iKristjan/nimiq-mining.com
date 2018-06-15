import Vue from 'vue'

Vue.filter('friendlyHashrate', function(hashrate, fractionDigits) {
    let steps = ['k', 'M', 'G', 'T', 'P', 'E', 'Z']
    let prefix = ''
    // eslint-disable-next-line
    for (let i = 0, step; step = steps[i]; ++i) {
      if (hashrate / 1000 < 1) {
        break
      }
      else {
        hashrate /= 1000
        prefix = step
      }
    }
    let unit = ' ' + prefix + 'H/s'
    if (fractionDigits === undefined) {
      hashrate = hashrate.toFixed(2)
    }
    else if (typeof fractionDigits === 'number' && fractionDigits > 0) {
      hashrate = hashrate.toFixed(fractionDigits)
    }
    return hashrate + unit
  }
)

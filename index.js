
const round = require('round')

let cache = JSON.parse(localStorage.getItem('quench')) || {}
let active = 0

window.quench = exports

exports.bench = function(id) {
  const start = performance.now()
  active += 1
  return function done() {
    const elapsed = round(performance.now() - start, 2)
    const times = cache[id] || []
    times.push(elapsed)
    cache[id] = times
    if (--active == 0) {
      save()
    }
  }
}

exports.median = function(id) {
  const times = cache[id].slice().sort()
  if (times.length % 2) {
    const i = Math.floor(times.length / 2)
    return times[i]
  }
  const i = times.length / 2
  return (times[i - 1] + times[i]) / 2
}

exports.mean = function(id) {
  let sum = 0
  cache[id].forEach(time => (sum += time))
  return sum / cache[id].length
}

exports.clear = function(id) {
  if (arguments.length == 0) {
    cache = {}
    localStorage.removeItem('quench')
  } else {
    delete cache[id]
    save()
  }
}

function save() {
  localStorage.setItem('quench', JSON.stringify(cache))
}


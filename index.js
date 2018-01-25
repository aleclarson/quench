
const round = require('round')

const CACHE_KEY = 'quench'
const REPS_KEY = 'quench.reps'

let cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}
let active = 0

window.quench = exports

exports.keys = function() {
  return Object.keys(cache)
}

exports.read = function(id) {
  return cache[id].slice()
}

exports.repeat = function(max, delay = 1000) {
  let reps = localStorage.getItem(REPS_KEY)
  if (reps == 0) {
    localStorage.removeItem(REPS_KEY)
  } else {
    reps = (reps || max) - 1
    localStorage.setItem(REPS_KEY, reps)
    setTimeout(() => location.reload(), delay)
  }
}

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
  return round((times[i - 1] + times[i]) / 2, 2)
}

exports.mean = function(id) {
  let sum = 0
  cache[id].forEach(time => (sum += time))
  return round(sum / cache[id].length, 2)
}

exports.clear = function(id) {
  if (arguments.length == 0) {
    cache = {}
    localStorage.removeItem(CACHE_KEY)
  } else {
    delete cache[id]
    save()
  }
}

function save() {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}


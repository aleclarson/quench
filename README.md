
# quench v0.0.1 

Simple benchmarking for browsers.

Measurements are saved with `localStorage` over multiple page refreshes.

```js
// Using a module bundler:
const {bench} = require('quench')

// Start a measurement.
const done = bench('do something')

// Finish a measurement.
done()

// Get the median measurement for an event.
quench.median('do something')

// Get the average measurement for an event.
quench.mean('do something')
```


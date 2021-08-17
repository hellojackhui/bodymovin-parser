'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./lib/lottie-compiler-web.umd.js.js')
  } else {
    module.exports = require('./lib/lottie-compiler-web.es.js.js')
  }
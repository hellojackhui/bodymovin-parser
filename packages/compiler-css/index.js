'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./lib/compiler-css.umd.js')
  } else {
    module.exports = require('./lib/compiler-css.es.js')
  }
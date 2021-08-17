'use strict'
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./lib/lottie-compiler-core.umd.js');
} else {
    module.exports = require('./lib/lottie-compiler-core.es.js');
}
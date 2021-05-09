'use strict'
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./lib/compiler-core.umd.js');
} else {
    module.exports = require('./lib/compiler-core.es.js');
}
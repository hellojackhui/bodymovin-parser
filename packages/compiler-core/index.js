'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('../../lib/compiler-core.umd');
} else {
    module.exports = require('../../lib/compiler-core.es').default;
}
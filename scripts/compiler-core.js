const ParserCore = require('../lib/core.umd');
const json = require('../mock/loading.json');
const box = require('../mock/box.json');
const core =  new ParserCore({json: box});
console.log(JSON.stringify(core.outputJson()));
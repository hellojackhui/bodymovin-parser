const ParserCore = require('../lib/compiler-core/compiler-core.umd');
const json = require('../mock/loading.json');
// const box = require('../mock/box.json');
const core =  new ParserCore({json: json});
console.log(JSON.stringify(core.outputJson()));
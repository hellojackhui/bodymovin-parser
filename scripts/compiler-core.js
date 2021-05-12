const ParserCore = require('../packages/compiler-core/lib/compiler-core.umd');
const json = require('../mock/hand.json');
// const box = require('../mock/box.json');
const core =  new ParserCore({json: json});
console.log(JSON.stringify(core.outputJson()));
const ParserCore = require('../packages/compiler-core/lib/compiler-core.umd');
const envelope = require('../mock/envelope.json');
// const json = require('../mock/loading.json');
const json = require('../mock/bowl.json');
const core =  new ParserCore({json: json});
// console.log(JSON.stringify(core.outputJson()));
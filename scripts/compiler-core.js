const ParserCore = require('../packages/compiler-core/lib/compiler-core.umd');
// const tree = require('../mock/demo1.json');
// const json = require('../mock/loading.json');
const json = require('../mock/bowl.json');
const core =  new ParserCore({json: json});
console.log(JSON.stringify(core.outputJson()));
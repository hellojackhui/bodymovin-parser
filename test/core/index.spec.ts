const Parser = require('../../packages/compiler-core/lib/compiler-core.umd');
const hand = require('../../mock/hand.json');

describe('core-parser', () => {
    test('parserInitial', () => {
        const inst = new Parser({
            json: hand
        })
        const outputJSON = inst.outputJSON();
        expect(outputJSON.name).toEqual('手');
    })
})
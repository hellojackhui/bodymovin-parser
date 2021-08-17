const Parser = require('../../packages/lottie-compiler-core/lib/lottie-compiler-core.umd');
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
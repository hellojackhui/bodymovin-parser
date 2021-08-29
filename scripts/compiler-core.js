const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const basePath = path.resolve(__dirname, '../lib/demo/mock/');
const CoreParser = require('../packages/lottie-compiler-core/lib/lottie-compiler-core.umd');
const tree = require('../mock/big1.json');

const url = 'http://portal-portm.meituan.com/test/wmmp/4.json';

// axios.get(url).then((res) => {
//     // const data = res.data;
//     const core =  new CoreParser({json: tree});
//     const jsonstr = JSON.stringify(core.outputJSON());
//     writeJSONFile(jsonstr);
// })


Promise.resolve(tree).then((tree) => {
    // const data = res.data;
    const core =  new CoreParser({json: tree});
    const jsonstr = JSON.stringify(core.outputJSON());
    writeJSONFile(jsonstr);
})


function writeJSONFile(content) {
    fs.writeFile(`${basePath}/mock.json`, content, function(err) {
        try {
            if (err) {
                return Promise.reject('error', err);
            } else {
                return Promise.resolve('success');
            }
        } catch(e) {
            console.log(e);
        }
    })
}
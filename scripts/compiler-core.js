const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const basePath = path.resolve(__dirname, '../lib/demo/mock/');
const CoreParser = require('../packages/compiler-core/lib/compiler-core.umd');
// const tree = require('../mock/demo1.json');

const url = 'http://portal-portm.meituan.com/test/wmmp/page-loading.json';

axios.get(url).then((res) => {
    const data = res.data;
    const core =  new CoreParser({json: data});
    const jsonstr = JSON.stringify(core.outputJson());
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
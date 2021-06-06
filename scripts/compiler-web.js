const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const ParserToCSS = require('../packages/compiler-web/lib/compiler-web.umd');

const json = require('../mock/hand.json');
const basePath = path.resolve(__dirname, '../lib/demo/mock/');

const fetch = (url) => {
    return axios.get(url).then((res) => {
        return res.data;
    })
}

const instance = new ParserToCSS({
    requestFn: fetch,
    config: {
        mode: 'html'
    }
})

// instance.parseByUrl('http://portal-portm.meituan.com/test/wmmp/page-loading.json').then(({
//     cssContent,
//     domContent
// }) => {
//     writeHTMLFile(domContent);
//     writeCssFile(cssContent);
// })

Promise.resolve(instance.parseByJson(json)).then(({
    cssContent,
    domContent
}) => {
    console.log(cssContent);
    writeHTMLFile(domContent);
    writeCssFile(cssContent);
})

function writeHTMLFile(content) {
    let template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>magic-css-demo</title><link rel="stylesheet" href="./index.css"></script></head><body style="width: 100vw;height: 100vh;box-sizing: border-box;">{{slot}}</body></html>';
    template = template.replace(/\{\{slot\}\}/, content);
    fs.writeFile(`${basePath}/index.html`, template, function(err) {
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

function writeCssFile(content) {
    fs.writeFile(`${basePath}/index.css`, content, function(err) {
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
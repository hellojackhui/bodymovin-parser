const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const ParserToCSS = require('../packages/compiler-web/lib/compiler-web.umd');

const json = require('../mock/loading.json');
const basePath = path.resolve(__dirname, '../lib/demo/mock/');

const fetch = (url) => {
    return axios.get(url).then((res) => {
        return res.data;
    })
}

const instance = new ParserToCSS({
    requestFn: fetch,
    config: {
        mode: 'html',
        assetsOrigin: 'https://s3plus.meituan.net/v1/mss_e2fc5719a5b64fa4b3686b72e677a48e/wmmp/lottie/',
    },
    json,
})

// instance.parseByUrl('https://s3plus.meituan.net/v1/mss_e2fc5719a5b64fa4b3686b72e677a48e/wmmp/lottie/bowl1.json').then(({
//     cssContent,
//     domContent
// }) => {
//     writeHTMLFile(domContent);
//     writeCssFile(cssContent);
// })

// console.log(instance.outputCSSTree());

Promise.resolve(instance.parseByJson(json)).then(({
    cssContent,
    domContent
}) => {
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
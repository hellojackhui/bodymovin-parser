const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const MpCompiler = require('../packages/lottie-compiler-mp/lib/lottie-compiler-mp.umd');

const json = require('../mock/shapes-loading.json');
const basePath = path.resolve(__dirname, '../example/miniprogram/pages/index/');

const fetch = (url) => {
    return axios.get(url).then((res) => {
        return res.data;
    })
}

const instance = new MpCompiler({
    mode: 'animate',
    request: fetch,
    options: {
        fullFrames: false,
    }
})

instance.parseByUrl('http://portal-portm.meituan.com/test/wmmp/page-loading2.json').then((data) => {
    console.log(data.frames['AELayer-2'].frames.map((item) => item.scale3d));
    // writeMpWXMLFile(data.domContent);
    // writeMpWXSSFile(data.cssContent);
})

function writeMpWXMLFile(content) {
    let template = '<view class="wrapper">{{slot}}</view>';
    template = template.replace(/\{\{slot\}\}/, content);
    fs.writeFile(`${basePath}/index.wxml`, template, function(err) {
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

function writeMpWXSSFile(content) {
    let template = '.wrapper {display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh; background-color: black; } {{slot}}';
    template = template.replace(/\{\{slot\}\}/, content);
    fs.writeFile(`${basePath}/index.wxss`, template, function(err) {
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
const axios = require('axios').default;
const ParserToCSS = require('../lib/compiler-css/compiler-css.umd');

const json = require('../mock/box.json');

const fetch = (url) => {
    return axios.get(url).then((res) => {
        return res.data;
    })
}

const instance = new ParserToCSS({
    requestFn: fetch,
    config: {
        mode: 'anime'
    }
})

instance.parseByFetch('http://portal-portm.meituan.com/test/wmmp/loading.json')
# @bodymovin-parser/compiler-web

bodymovin web代码生成器


## 基本使用

```js

// 使用本地json
const WebParser = require('@bodymovin-parser/compiler-web');
const json = require('xxx.json');

const ins = new WebParser({
    mode: 'html',   // 输出模式
    assetsOrigin: '',   // 资源源路径
})

const {
    cssContent,
    domContent
} = ins.parseByJson(json);

// 使用网络资源
const WebParser = require('@bodymovin-parser/compiler-web');
const ins = new WebParser({
    mode: 'html',
    requestFn: (url) => axios.get(url),
})

ins.parseByUrl(url).then(({
    cssContent,
    domContent
}) => {
    // TODO...
});

```
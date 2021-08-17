# lottie-compiler-core
bodymovin小程序代码生成器

# 功能
1. 基于bodymovin生成适配小程序运行的dom/css代码
2. 基于微信帧动画方案this.animate方法，生成帧动画序列

# 说明
1. 由于小程序平台对svg支持较差，现只支持图层级的动画解析
2. this.animate属于js控制动画渲染，如果帧数过多会导致卡顿，所以需要控制帧数

# 使用

```js

import MPCompiler from '@wmfe/lottie-compiler-mp';
const axios = require('axios').default;


const fetch = (url) => {
    return axios.get(url).then((res) => {
        return res.data;
    })
}

const instance = MPCompiler({
    mode: 'animate' // 帧动画模式
    // mode: 'css'  //  css代码导出
    request: fetch// url加载资源时，预置请求
    options: {
        duration // 自定义动画执行时间
        infinite    // 是否循环播放
    }
})

// url解析-mode: css
const {
    domTree // dom树
    frames  // 每个图层的帧动画序列
} = instance.parseByUrl(url);

// url解析-mode: animate
const {
    domContent // dom字符串
    cssContent  // css字符串
} = instance.parseByJson(json);

```
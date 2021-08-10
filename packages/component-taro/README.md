# component-taro
taro动效组件

## 何时应用
基于ae-bodymovin的动效组件

## 须知
本组件由于使用[this.animate](https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html)动画帧方法，故暂只支持微信小程序

## 代码演示
```javascript


```

## 效果展示

## 属性

参数|说明|类型|默认值|版本
:---|:---|:---|:---|:---
source|数据源|JSON｜string|''|0.0.1
autoPlay|自动播放|boolean|false|0.0.1
infinite|是否循环播放|boolean|false|0.0.1
duration|播放时间|number|1000|0.0.1
onFinish|播放完成回调|function|() => {}|0.0.1
onLoad|资源加载完成|function|() => {}|0.0.1
onStart|播放完成回调|function|() => {}|0.0.1
# @wmfe/lottie-compiler-core

lottie动画核心解析器

## 目的

基于AE导出的bodymovin插件导出的JSON文件，生成通用ast，用于跨平台解析与渲染

## 能力

1. 属性语义化
2. 层级化，正确表达图层父子结构，便于元素渲染
3. keyframes预生成，包含每一帧图层渲染状态，便于运用js计算能力，实现动画播放

## 能力范围

能够实现完全基于图片图层的动画JSON解析，shapes图层、表达式计算能力将在未来完成支持。

## 如何使用
```javascript
import Parser from '@wmfe/lottie-compiler-core';

const ParserInstance = new Parser({
    source: AeJSON,
    options: {
        fullFrames: true // 是否为全帧模式
    }
})

// 返回解析ast
const output = inst.output();
// 返回原数据
const source = inst.getSourceData();
// 返回某一图层数据
const source = inst.getSelectedLayerData(layerId);
```


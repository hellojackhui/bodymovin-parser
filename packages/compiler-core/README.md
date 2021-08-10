# @bodymovin-parser/compiler-core
bodymovin通用解析器

## 工程目的

基于AE导出的bodymovin.json，生成通用ast，用于跨平台解析与渲染

## 能力

1. 属性语义化
2. 层级化，正确表达图层父子结构，便于元素渲染
3. keyframes预生成，包含每一帧图层渲染状态，便于动画生成
4. 作为代码生成器的基础工程，正在不断完善和改进中

## 能力范围

能够实现基于图层 + 蒙板的json解析，shapes解析、表达式解析正在开发中。

## 如何使用
```javascript
import Parser from '@bodymovin-parser/compiler-core';

const inst = new Parser({
    json: json
})

// output parsed json
const output = inst.outputJSON();

```


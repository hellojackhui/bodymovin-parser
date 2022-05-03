import { IMagicLottieInstance } from "./layer";

export interface IMagicCompiler {
    dataSource: JSON;  // 数据源
    options: IMagicCompilerOptions; // 参数
    magicLottieAST: IMagicLottieInstance; // magic产出json实例
    errorList: any[]; // 错误信息列表
    verifySourceData: (dataSource: JSON) => any;
    getSourceData: () => JSON;  // 获取数据源
    getSelectedLayerSourceData: (layerId: string) => JSON; // 获取某一图层的动画数据
    getCompiledData: () => {[x: string]: any};   // 获取magic生成的json数据
}

export interface IMagicCompilerOptions {
    fullFrames?: boolean;
}
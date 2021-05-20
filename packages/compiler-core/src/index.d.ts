export interface ICompiler {
    json: JSON;
    bmversion: string;
    name: string;
    startframe: number;
    endframe: number;
    frame: number;
    layer: IRootWrapper;
    is3dLayer: boolean;
    assetsObj: {
        [x: string]: IAsset
    };
}

export interface ICompilerOutput {
    version: string;
    name: string;
    startframe: number;
    endframe: number;
    frame: number;
}

export interface IRootWrapper {
    type: string;
    width: number;
    height: number;
    children: Array<any>;
    layer: object;
}

export interface IRootLayer {

}

export interface IAsset {
    _unionId: string;
    type: string;
    id: string;
    width: number;
    height: number;
    path: string;
}

export interface IScale {
    ksSource: object;
    nextKsSource: object;
    startTime: number;
    endTime: number;
    duration: number;
    startVal: number[];
    endVal: number[];
    bezierFn: any;
    bezierStr: string;
}

export interface IRotate {
    ksSource: any;
    nextKsSource: any;
    startTime: number;
    endTime: number;
    duration: number;
    startVal: number;
    endVal: number;
    bezierFn: any;
    bezierStr: string;
}

export interface IPosition {
    startTime: number;
    endTime: number;
    duration: number;
    startVal: number[];
    endVal: number[];
    bezierFn: any;
    bezierStr: string;
    parabolaPointList: any;
}

export interface IOpacity {
    ksSource: any;
    nextKsSource: any;
    startTime: number;
    endTime: number;
    duration: number;
    startVal: number;
    endVal: number;
    bezierFn: any;
    bezierStr: string;
}
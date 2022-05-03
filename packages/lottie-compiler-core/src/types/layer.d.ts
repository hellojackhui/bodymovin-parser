import { EBlendMode, EIsAnimate, ELayerType, OBlendMode, OIsAnimate, OLayerType } from "../utils/constant";
export interface IMagicLottieInstance {
    version: string; // 
    frames: number;
    startFrame: number;
    endFrame: number;
    name: string;
    is3dLayer: boolean;
    layers: IMagicImageRootLayer;
    markers: any[];
}

export interface IMagicAssets {
    refId: string;
    assetSize: {
        width: number,
        height: number,
    };
    path: string;
}

export interface IMagicImageLayer {
    index: number;
    level: string;
    name: string;
    layerType: typeof OLayerType[keyof typeof ELayerType],
    sizeInfo: {
        width: number,
        height: number,
    },
    assetInfo: {
        imageType: string;
        path: string,
    },
    playInfo: {
        hasAnimation: typeof OIsAnimate[keyof typeof EIsAnimate];
        initFrame: number;
        endFrame: number;
        startTime: number;
        blendMode: typeof OBlendMode[keyof typeof EBlendMode];
        is3dLayer: boolean;
        timeStretch: number;
    },
    keyFrames: IMagicImageLayerAnimation[];
    children: IMagicImageLayer[];
}

export interface IMagicImageRootLayer extends IMagicImageLayer {}

export interface IMagicImageLayerAnimation {
    index: number;
    offset: number;
    opacity: number;
    rotate: number[];
    position: number[];
    anchor: number[];
    scale: number[];
}

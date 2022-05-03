import { IMagicImageLayer, IMagicImageLayerAnimation, IMagicImageRootLayer, IMagicLottieInstance } from '../types/layer.d';
import { ELayerType } from '../utils/constant';
class MagicLottieInstance implements IMagicLottieInstance {
    version: string; // 
    frames: number;
    startFrame: number;
    endFrame: number;
    name: string;
    is3dLayer: boolean;
    layers: IMagicImageRootLayer;
    markers: any[];
    
    constructor(data) {
        const { v, nm, ip, op, fr, ddd = 0, markers } = data;
        this.version = v;
        this.name = nm;
        this.startFrame = ip;
        this.endFrame = op;
        this.frames = fr;
        this.is3dLayer = !!ddd;
        this.markers = markers;
        this.layers = new MagicImageRootLayer(data);
    }
}

class MagicImageRootLayer implements IMagicImageRootLayer {
    
    index: number;
    level: string;
    name: any;
    layerType: ELayerType;
    sizeInfo: { width: any; height: any; };
    assetInfo: any;
    playInfo: any;
    keyFrames: any;
    children: any[];
    
    constructor(data) {
        const {
            nm,
            w,
            h,
        } = data;
        this.index = 0;
        this.level = '0';
        this.name = nm;
        this.layerType = ELayerType.NULL;
        this.sizeInfo = {
            width: w,
            height: h,
        }
        this.assetInfo = null;
        this.playInfo = null;
        this.keyFrames = null;
        this.children = this.buildMagicTreeLayer(data);
    }

    buildMagicTreeLayer(data) {
        
        return [];
    }

}

export default MagicLottieInstance;

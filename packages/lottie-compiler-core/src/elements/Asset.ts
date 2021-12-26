import { IAsset } from "../index.d";

enum LayerTypeEnum {
    'precomp' = 0,
    'solid' = 1,
    'image' = 2,
    'null' = 3,
    'shape' = 4,
    'text' = 5,
}

class Asset implements IAsset {
    public assetsSource: any;
    public type: string;
    public id: any;
    public width: any;
    public height: any;
    public path: any;
    public _unionId: string;
    public parentId: string;

    constructor({
        asset,
        options,
    }) {
        this.buildAssets(asset, options);
    }

    buildAssets(assets, options) {
        const { id, w, h, u, p } = assets;
        const { ind: index, level, parent = 0, w: width, h: height } = options.layer;
        const { layerType = 2, } = options;
        this._unionId = `layer-bm-${level}-${index}`;
        this.parentId = `layer-bm-${level - 1}-${parent}`;
        this.type = this.getNodeType(layerType);
        this.id = id;
        this.width = width || w;
        this.height = height || h;
        this.path = this.buildUrlPath(u, p);
    }

    getNodeType(type) {
        switch (type) {
            case LayerTypeEnum.image:
                return 'image';
            case LayerTypeEnum.shape:
                return 'shape';
            case LayerTypeEnum.text:
                return 'text';
            default:
                return 'image';
        }
    }

    getUnionId() {
        return this._unionId;
    }

    buildUrlPath(url, path) {
        if (/base64/.test(path)) {
            return path;
        } else if (url || path) {
            return `${url}${path}`;
        }
    }
}

export default Asset;
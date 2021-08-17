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

    constructor({
        asset,
        options,
    }) {
        this.buildAssets(asset, options);
    }

    buildAssets(assets, options) {
        const { id, w, h, u, p } = assets;
        const { index, layerType = 2 } = options;
        this._unionId = `layer-bm-${index}`;
        this.type = this.getNodeType(layerType);
        this.id = id;
        this.width = w;
        this.height = h;
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

    buildUrlPath(url, path) {
        if (/base64/.test(path)) {
            return path;
        } else if (url || path) {
            return `${url}${path}`;
        }
    }
}

export default Asset;
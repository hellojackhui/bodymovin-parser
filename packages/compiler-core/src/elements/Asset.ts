import { IAsset } from "../index.d";
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
        index,
    }) {
        this.buildAssets(asset, index);
    }

    buildAssets(assets, index) {
        const { id, w, h, u, p } = assets;
        this._unionId = `layer-bm-${index}`;
        this.type = this.getNodeType(assets.p);
        this.id = id;
        this.width = w;
        this.height = h;
        this.path = this.buildUrlPath(u, p);
    }

    getNodeType(path) {
        return path ? 'image' : 'node';
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
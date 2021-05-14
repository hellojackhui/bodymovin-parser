class Asset {
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
        this._unionId = `layer-bm-${index + 1}`;
        this.buildAssets(asset);
    }

    buildAssets(assets) {
        const { id, w, h, u, p } = assets;
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
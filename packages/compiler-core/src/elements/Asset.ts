class Asset {
    public assetsSource: any;
    public type: string;
    public id: any;
    public width: any;
    public height: any;
    public path: any;

    constructor(assets) {
        this.buildAssets(assets);
    }

    buildAssets(assets) {
        const { id, w, h, u, p } = assets;
        this.type = 'node';
        this.id = id;
        this.width = w;
        this.height = h;
        this.path = this.buildUrlPath(u, p);
    }

    buildUrlPath(url, path) {
        if (/base64/.test(path)) {
            return path;
        } else if (url) {
            return `${url}${path}`;
        }
    }
}

export default Asset;
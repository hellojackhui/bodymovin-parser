// 解析器核心类
import Asset from './elements/Asset';
import Layer from './elements/Layer';
class ParserCore {
    
    public json: any;
    public endframe: any;
    public name: any;
    public startframe: any;
    public frame: any;
    public layer: {};
    public assetsObj: {};
    
    constructor({
        json,
    }) {
        this.json = json;
        this.buildBaseInfo();
        this.buildWrapperInfo();
        this.buildAssets();
        this.buildLayers();
    }

    buildBaseInfo() {
        const { nm, ip, op, fr } = this.json;
        this.name = nm;
        this.startframe = ip;
        this.endframe = op;
        this.frame = fr;
        this.layer = {};
        this.assetsObj = {};
    }

    buildWrapperInfo() {
        const { w, h } = this.json;
        const node = {
            type: 'node',
            width: w,
            height: h,
            children: [],
            layer: {},
        }
        this.layer = node;
        return;
    }

    buildAssets() {
        const { assets } = this.json;
        const source = [];
        assets.forEach((asset) => {
            const assetInstance = new Asset(asset);
            source.push(assetInstance);
            this.assetsObj[asset.id] = assetInstance;
        })
        this.layer['children'] = source;
        return;
    }

    outputJson() {
        return {
            name: this.name,
            startframe: this.startframe,
            endframe: this.endframe,
            frame: this.frame,
            layer: this.layer,
        }
    }


    buildLayers() {
        const { layers } = this.json;
        if (!layers || !layers.length) return;
        const frameCount = this.endframe - this.startframe + 1;
        layers.forEach(layer => {
            const layerInstance = new Layer({
                layer,
                frames: frameCount < this.frame + 1 ? this.frame + 1 : frameCount,
            });
            let layerId = layerInstance.getId();
            this.assetsObj[layerId].layer = layerInstance;
        });
    }

}

export default ParserCore;

// 解析器核心类
import Asset from "./elements/Asset";
import Layer from "./elements/Layer";
class ParserCore {
  public json: any;
  public endframe: any;
  public name: any;
  public startframe: any;
  public frame: any;
  public layer: {};
  public assetsObj: {};

  constructor({ json }) {
    this.json = json;
    this.buildBaseInfo();
    this.buildWrapperInfo();
    this.buildAssets();
    this.buildLayers();
    this.buildLayerTree();
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
      type: "node",
      width: w,
      height: h,
      children: [],
      layer: {},
    };
    this.layer = node;
    return;
  }

  buildAssets() {
    const { assets, layers } = this.json;
    layers.forEach((layer, index) => {
      let assetId = layer.refId;
      let assetArr = assets.filter((item) => item.id === assetId);
      if (assetArr.length) {
        const assetInstance = new Asset({
          asset: assetArr[0],
          index,
        });
        this.assetsObj[assetInstance._unionId] = assetInstance;
      } else {
        const { sw: w, sh: h } = layer;
        if (w) {
          const assetInstance = new Asset({
            asset: {
              id: `layer_element-${index}`,
              w,
              h,
              p: "",
            },
            index,
          });
          this.assetsObj[assetInstance._unionId] = assetInstance;
        }
        return;
      }
    });
    return;
  }

  outputJson() {
    return {
      name: this.name,
      startframe: this.startframe,
      endframe: this.endframe,
      frame: this.frame,
      layer: this.layer,
    };
  }

  buildLayers() {
    const { layers } = this.json;
    if (!layers || !layers.length) return;
    const frameCount = this.endframe - this.startframe;
    layers.forEach((layer, index) => {
      if (layer.ks) {
        const layerInstance = new Layer({
          layer,
          frames: frameCount,
          startFrame: this.startframe,
        });
        let parentId = layerInstance.getParentId();
        let unionId = layerInstance.getUnionId();
        this.assetsObj[unionId]["parentId"] = parentId;
        this.assetsObj[unionId].layer = layerInstance;
      }
    });
    return;
  }

  buildLayerTree() {
    let obj = this.assetsObj;
    Object.keys(obj).forEach((key) => {
      let layer = obj[key];
      if (layer.parentId && obj[layer.parentId]) {
        let parent = obj[layer.parentId];
        parent["children"]
          ? parent["children"].push(layer)
          : (parent["children"] = [layer]);
      }
      if (layer.parentId !== "layer-bm-0") {
        delete obj[key];
      }
    });
    this.layer["children"] = Object.values(this.assetsObj);
    return;
  }
}

export default ParserCore;

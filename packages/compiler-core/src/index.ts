// 解析器核心类
import Asset from "./elements/Asset";
import Layer from "./elements/Layer";
import { isCommonAssets, isLayerAssets } from "./utils/utils";
import * as Compiler from './index.d';

enum LayerTypeEnum {
  'precomp' = 0,
  'solid' = 1,
  'image' = 2,
  'null' = 3,
  'shape' = 4,
  'text' = 5,
}

class CoreParser implements Compiler.ICompiler {

  public json: any;
  public bmversion: string;
  public endframe: any;
  public name: any;
  public is3dLayer: boolean;
  public startframe: any;
  public frame: any;
  public layer: Compiler.IRootWrapper;
  public assetsObj: {};

  constructor({ json }) {
    this.json = json;
    this.buildBaseInfo();
    this.buildRootWrapperInfo();
    this.buildAssets();
    this.buildLayers();
    this.buildLayerTree();
  }

  buildBaseInfo() {
    const { v, nm, ip, op, fr, ddd = 0 } = this.json;
    this.bmversion = v;
    this.name = nm;
    this.startframe = ip;
    this.endframe = op;
    this.frame = fr;
    this.is3dLayer = !!ddd;
    this.assetsObj = {};
  }

  buildRootWrapperInfo() {
    const { w: width, h: height } = this.json;
    const node = {
      type: "node",
      width,
      height,
      children: [],
      layer: {},
    };
    this.layer = node;
  }

  buildAssets() {
    const { assets, layers } = this.json;
    layers.forEach((layer, index) => {
      switch (layer.ty) {
        case LayerTypeEnum.image:
          this.buildAssetInstance(assets, layer);
          break;
        case LayerTypeEnum.precomp:
          this.buildCompAssetInstance(assets, layer);
          break;
        case LayerTypeEnum.solid:
          this.buildSolidInstance(layer, index);
          break;
        case LayerTypeEnum.shape:
          this.buildShapesInstance(assets, layer);
          break;
        default:
          this.buildAssetInstance(assets, layer);
          break;
      }
    });
    return;
  }

  buildAssetInstance(assets, layer) {
    let assetId = layer.refId;
    let assetArr = assets.filter((item) => item.id === assetId);
    if (!assetArr || !assetArr.length) {
      return;
    }
    let target = assetArr[0];
    const assetInstance = new Asset({
      asset: target,
      options: {
        index: layer.ind,
        layerType: layer.ty,
      }
    });
    this.assetsObj[assetInstance._unionId] = assetInstance;
  }

  buildCompAssetInstance(assets, layer) {
    let assetId = layer.refId;
    let assetArr = assets.filter((item) => item.id === assetId);
    if (!assetArr || !assetArr.length) {
      return;
    }
    let target = assetArr[0];
    return this.rebuildAssetsTree({
      cur: target, 
      id: assetId,
    });
  }

  buildSolidInstance(layer, index) {
    const { sw: w, sh: h } = layer;
    const tempAsset = {
      id: `layer_element-${index}`,
      w,
      h,
      p: "",
    };
    const assetInstance = new Asset({
      asset: tempAsset,
      options: {
        index,
        layerType: LayerTypeEnum.image,
      }
    });
    this.assetsObj[assetInstance._unionId] = assetInstance;
  }

  buildShapesInstance(assets, layer) {
    // TODO...
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
    layers.forEach((layer) => {
      if (layer.ks) {
        const layerInstance = new Layer({
          layer,
          frames: frameCount,
          startFrame: this.startframe,
          json: this.json,
        });
        this.linkLayerToAsset({
          layer: layerInstance,
        });
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

  rebuildAssetsTree({
    cur, 
    id,
  }) {
    let { layers, assets } = this.json;
    let targetLayerIndex = layers.findIndex((layer) => layer.refId === id);
    let targetAssetIndex = assets.findIndex((asset) => asset.refId === id);
    let targetLayer = layers[targetLayerIndex];
    cur.layers.forEach((layer) => {
      layer.parent = targetLayerIndex + 1;
      layer.ind += targetLayerIndex + 1;
    });
    layers.push(...cur.layers);
    assets.splice(targetAssetIndex, 1);
    const templeAssets = {
      id: targetLayer.refId,
      w: targetLayer.w,
      h: targetLayer.h,
      e: 1,
      u: '',
      p: '',
    };
    assets.push(templeAssets);
    return this.buildAssets();
  }

  linkLayerToAsset({ layer }) {
    let parentId = layer.getParentId();
    let unionId = layer.getUnionId();
    if (this.assetsObj[unionId]) {
      this.assetsObj[unionId]["parentId"] = parentId;
      this.assetsObj[unionId].layer = layer;
    } else {
      console.warn('layer cannot link to asset, please check your asset. unionid:', layer._unionId)
    }
  }

}

export default CoreParser;

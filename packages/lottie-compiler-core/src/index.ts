// 解析器核心类
import Asset from "./elements/Asset";
import Layer from "./elements/Layer";
import Shapes from "./elements/Shapes";
import Text from "./elements/Text";
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
  private _json: any;
  public bmVersion: string;
  public endFrame: any;
  public name: any;
  public is3dLayer: boolean;
  public startFrame: any;
  public frame: any;
  public maskIndex: number;
  public layer: Compiler.IRootWrapper;
  public assetList: {};
  public errorList: Array<Compiler.ErrorItem>;

  constructor({ json }) {
    this._json = json;
    this.json = json;
    this.buildCoreParseModal();
    this.buildAssetsModal();
    this.buildLayersModal();
    this.buildLayerTree();
  }

  buildCoreParseModal() {
    const { v, nm, ip, op, fr, ddd = 0, w: width, h: height } = this._json;
    this.bmVersion = v;
    this.name = nm;
    this.startFrame = ip;
    this.endFrame = op;
    this.frame = fr;
    this.is3dLayer = !!ddd;
    this.maskIndex = 0;
    this.assetList = {};
    this.errorList = [];
    this.layer = {
      type: "node",
      width,
      height,
      children: [],
      layer: {},
    };
  }

  buildAssetsModal() {
    const { assets, layers } = this._json;
    layers.forEach((layer, index) => {
      switch (layer.ty) {
        case LayerTypeEnum.image:
          this.buildAssetInstance(assets, layer);
          break;
        case LayerTypeEnum.precomp:
          this.buildCompInstance(assets, layer);
          break;
        case LayerTypeEnum.solid:
          this.buildSolidInstance(layer);
          break;
        case LayerTypeEnum.shape:
          this.buildShapesInstance(layer);
          break;
        case LayerTypeEnum.text:
          this.buildTextInstance(layer);
          break;
        case LayerTypeEnum.null:
          this.buildEmptyInstance(layer);
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
    const assetInstance = new Asset({
      asset: assetArr[0],
      options: {
        index: layer.ind,
        layerType: layer.ty,
      }
    });
    this.assetList[assetInstance._unionId] = assetInstance;
    return;
  }

  buildCompInstance(assets, layer) {
    let assetId = layer.refId;
    let assetArr = assets.filter((item) => item.id === assetId);
    if (!assetArr || !assetArr.length) {
      return;
    }
    return this.rebuildAssetsTree({
      cur: assetArr[0],
      id: assetId,
      layerId: layer.ind,
    });
  }

  buildSolidInstance(layer) {
    const { sw: w, sh: h, ind: index } = layer;
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
    this.assetList[assetInstance._unionId] = assetInstance;
  }

  buildEmptyInstance(layer) {
    const { w = 100, h = 100, ind: index } = layer;
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
    this.assetList[assetInstance._unionId] = assetInstance;
  }

  buildTextInstance(layer) {
    const { t: text, ind: index } = layer;
    const assetInstance = new Text({
      asset: text,
      options: {
        index,
        layerType: LayerTypeEnum.text,
      }
    });
    this.assetList[assetInstance._unionId] = assetInstance;
  }

  buildShapesInstance(layer) {
    if (!layer.shapes) return;
    const shapesList = layer.shapes.map((shape) => {
      return new Shapes({
        global: this,
        json: shape,
      })
    });
    const shapeModal = {
      shapeSource: shapesList,
      _unionId: `layer-bm-${layer.ind}`,
      id: layer.nm,
      type: LayerTypeEnum.shape,
    }
    this.assetList[`layer-bm-${layer.ind}`] = shapeModal;
  }

  outputJSON() {
    const baseOutput = {
      name: this.name,
      startFrame: this.startFrame,
      endFrame: this.endFrame,
      frame: this.frame,
      layer: this.layer,
    };
    if (this.errorList) {
      Object.assign(baseOutput, {
        errorList: this.errorList,
      })
    }
    return baseOutput;
  }

  outputSource() {
    return this.json;
  }

  buildLayersModal() {
    const { layers, w, h } = this._json;
    if (!layers || !layers.length) return;
    const frameCount = this.endFrame - this.startFrame;
    layers.forEach((layer) => {
      if (layer.ks) {
        const layerInstance = new Layer({
          layer,
          frames: frameCount,
          frame: this.frame,
          startFrame: this.startFrame,
          options: {
            w, 
            h,
          },
          ctx: this,
        });
        this.linkLayerToAsset({
          layer: layerInstance,
        });
      }
    });
    return;
  }

  buildLayerTree() {
    let obj = this.assetList;
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
    this.layer["children"] = Object.values(this.assetList);
    return;
  }

  // precomp类型
  rebuildAssetsTree({
    cur, 
    id,
    layerId,
  }) {
    let { layers, assets } = this._json;
    let targetLayerIndex = layers.findIndex((layer) => layer.refId === id && layerId === layer.ind);
    let targetAssetIndex = assets.findIndex((asset) => asset.refId === id || asset.id === id);
    let targetLayer = layers[targetLayerIndex];
    let targetAssets = assets[targetAssetIndex];

    if (cur.layers) {
      cur.layers.forEach((layer) => {
        layer.parent = targetLayer.ind;
        layer.ind += targetLayer.ind;
      });
      layers.push(...cur.layers);
    }

    // 更新动画模式
    targetLayer.ty = LayerTypeEnum.image;
    targetLayer.refId = targetAssets.layers[0].refId;
    targetLayer.ks = targetAssets.layers[0].ks;

    return this.buildAssetsModal();
  }

  linkLayerToAsset({ layer }) {
    let parentId = layer.getParentId();
    let unionId = layer.getUnionId();
    if (this.assetList[unionId]) {
      this.assetList[unionId]["parentId"] = parentId;
      this.assetList[unionId].layer = layer.outputJSON();
    } else {
      this.errorList.push({
        name: layer.name,
        type: 'lose asset link', 
      });
    }
  }

}

export default CoreParser;

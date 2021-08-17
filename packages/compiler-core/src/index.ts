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
  public bmVersion: string;
  public endFrame: any;
  public name: any;
  public is3dLayer: boolean;
  public startFrame: any;
  public frame: any;
  public maskIndex: number;
  public layer: Compiler.IRootWrapper;
  public assetsObj: {};
  public errorList: Array<Compiler.ErrorItem>;

  constructor({ json }) {
    this.json = json;
    this.buildCoreParseModal();
    this.buildAssetsModal();
    this.buildLayersModal();
    this.buildLayerTree();
  }

  buildCoreParseModal() {
    const { v, nm, ip, op, fr, ddd = 0, w: width, h: height } = this.json;
    this.bmVersion = v;
    this.name = nm;
    this.startFrame = ip;
    this.endFrame = op;
    this.frame = fr;
    this.is3dLayer = !!ddd;
    this.maskIndex = 0;
    this.assetsObj = {};
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
    const { assets, layers } = this.json;
    layers.forEach((layer) => {
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

  buildCompInstance(assets, layer) {
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
    this.assetsObj[assetInstance._unionId] = assetInstance;
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
    this.assetsObj[assetInstance._unionId] = assetInstance;
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
    this.assetsObj[`layer-bm-${layer.ind}`] = shapeModal;
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
    this.assetsObj[assetInstance._unionId] = assetInstance;
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
    const { layers, w, h } = this.json;
    if (!layers || !layers.length) return;
    const frameCount = this.endFrame - this.startFrame;
    layers.forEach((layer) => {
      if (layer.ks) {
        const layerInstance = new Layer({
          layer,
          frames: frameCount,
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
    let targetAssetIndex = assets.findIndex((asset) => asset.refId === id || assets.id === id);
    let targetLayer = layers[targetLayerIndex];
    if (cur.layers) {
      cur.layers.forEach((layer) => {
        layer.parent = targetLayerIndex + 1;
        layer.ind += targetLayerIndex + 1;
      });
      layers.push(...cur.layers);
    }
    assets.splice(targetAssetIndex, 1);
    targetLayer.ty = LayerTypeEnum.image;
    const templeAssets = {
      id: targetLayer.refId,
      w: targetLayer.w,
      h: targetLayer.h,
      e: 1,
      u: '',
      p: '',
    };
    assets.push(templeAssets);
    return this.buildAssetsModal();
  }

  linkLayerToAsset({ layer }) {
    let parentId = layer.getParentId();
    let unionId = layer.getUnionId();
    if (this.assetsObj[unionId]) {
      this.assetsObj[unionId]["parentId"] = parentId;
      this.assetsObj[unionId].layer = layer.outputJSON();
    } else {
      this.errorList.push({
        name: layer.name,
        type: 'lose asset link', 
      });
    }
  }

}

export default CoreParser;

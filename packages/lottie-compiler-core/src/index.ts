// 解析器核心类
// 1. 解析初始化参数
// 2. 基于layer进行树结构生成
// 3. 进行图层帧动画处理
// 4. 进行最终数据产出


import Asset from "./elements/Asset";
import Layer from "./elements/Layer";
import Shapes from "./elements/Shapes";
import Text from "./elements/Text";
import * as Compiler from './index.d';
import { LayerTypeEnum, TypeEnum } from './utils/constant';

class CoreParser implements Compiler.ICompiler {

  private _json: JSON;
  public options: Compiler.IOptions;
  public rebuildJSON: any;
  public bmVersion: string;
  public endFrame: any;
  public name: any;
  public is3dLayer: boolean;
  public startFrame: any;
  public frame: any;
  public maskIndex: number;
  public layer: Compiler.IRootWrapper;
  public level: number;
  public assetList: {};
  public errorList: Array<Compiler.ErrorItem>;

  constructor({ json, options = {} }) {
    this._json = JSON.parse(JSON.stringify(json));  // 原始json文件
    this.options = options;
    this.rebuildJSON = json; // 重新构建的json【应对合成层图层】
    this.buildCoreParseModal(); // 构建核心数据对象
    this.buildAssetsModal();  // 基于layers构建dom树
  }

  // 构建核心数据对象
  buildCoreParseModal() {
    const { v, nm, ip, op, fr, ddd = 0, w: width, h: height } = this.rebuildJSON;
    this.bmVersion = v;
    this.name = nm;
    this.startFrame = ip;
    this.endFrame = op;
    this.frame = fr;
    this.is3dLayer = !!ddd;
    this.maskIndex = 0;
    this.assetList = {};
    this.errorList = [];
    this.level = 0;
    this.layer = {
      type: "node",
      width,
      height,
      children: [],
      layer: {},
    };
  }

  // 基于layers构建assets模型
  buildAssetsModal(newLayers?: any) {
    const { assets, layers: sourceLayers } = this.rebuildJSON;
    // 初始化图层层级
    sourceLayers.forEach(layer => layer.level = 1);
    // 剔除状态为null的图层
    const layers = newLayers || sourceLayers.reduce((prev, next) => [...prev, ...next.ty === LayerTypeEnum['null'] ? [] : [next]], []);
    // 图层遍历
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
    return this.buildLayersModal(layers);
  }

  // 构建图片图层资源位
  buildAssetInstance(assets, layer) {
    let assetId = layer.refId;
    let assetArr = assets.filter((item) => item.id === assetId);
    if (!assetArr || !assetArr.length) {
      return;
    }
    const assetInstance = new Asset({
      asset: assetArr[0],
      options: {
        layer
      }
    });
    this.assetList[assetInstance.getUnionId()] = assetInstance;
    return;
  }

  buildCompInstance(assets, layer) {
    let assetId = layer.refId;
    let assetArr = assets.filter((item) => item.id === assetId);
    if (!assetArr || !assetArr.length) {
      return;
    }
    // 构建合成基础图层
    const { w, h, ind: index, level, } = layer;
    const assetInstance = new Asset({
      asset: {
        id: `layer_element-${level}-${index}`,
        w,
        h,
        p: "",
      },
      options: {
        layer,
        layerType: LayerTypeEnum.image,
      }
    });
    this.assetList[assetInstance.getUnionId()] = assetInstance;
    return this.rebuildAssetsTree({
      cur: assetArr[0],
      id: assetId,
      layerId: layer.ind,
    });
  }

  buildSolidInstance(layer) {
    const { sw: w, sh: h, ind: index, level } = layer;
    const tempAsset = {
      id: `layer_element-${level}-${index}`,
      w,
      h,
      p: "",
    };
    const assetInstance = new Asset({
      asset: tempAsset,
      options: {
        layer,
        layerType: LayerTypeEnum.image,
      }
    });
    this.assetList[assetInstance.getUnionId()] = assetInstance;
  }

  buildEmptyInstance(layer) {
    const { w = 100, h = 100, ind: index, level } = layer;
    const tempAsset = {
      id: `layer_element-${level}-${index}`,
      w,
      h,
      p: "",
    };
    const assetInstance = new Asset({
      asset: tempAsset,
      options: {
        layer,
        layerType: LayerTypeEnum.image,
      }
    });
    this.assetList[assetInstance.getUnionId()] = assetInstance;
  }

  buildTextInstance(layer) {
    const { t: text, ind: index, level } = layer;
    const textInstance = new Text({
      asset: text,
      options: {
        index,
        layerType: LayerTypeEnum.text,
        level,
      }
    });
    this.assetList[textInstance.getUnionId()] = textInstance;
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
      _unionId: `layer_element-${layer.level}-${layer.ind}`,
      id: layer.nm,
      type: LayerTypeEnum.shape,
    }
    this.assetList[`layer_element-${layer.level}-${layer.ind}`] = shapeModal;
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

  outputSourceData() {
    return this._json;
  }

  buildLayersModal(lys) {
    const { layers: sourceLayers, w, h } = this.rebuildJSON;
    if (!sourceLayers || !sourceLayers.length) return;
    const frameCount = this.endFrame - this.startFrame;
        // 剔除状态为null的图层
    let layers = lys || sourceLayers;
    layers = layers.reduce((prev, next) => [...prev, ...next.ty === LayerTypeEnum['null'] ? [] : [next]], []);
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
            ...this.options,
          },
          ctx: this,
        });
        this.linkLayerToAsset({
          layer: layerInstance,
        });
      }
    });
    return this.buildLayerTree();
  }

  buildLayerTree() {
    let obj = this.assetList;
    // console.log(this.assetList);
    Object.keys(obj).forEach((key) => {
      let layer = obj[key];
      if (layer.parentId && obj[layer.parentId]) {
        let parent = obj[layer.parentId];
        parent["children"]
          ? parent["children"].push(layer)
          : (parent["children"] = [layer]);
      }
      if (layer.parentId !== "layer-bm-0-0" || layer.type === TypeEnum[3]) {
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
    let { layers, assets } = this.rebuildJSON;
    let targetLayerIndex = layers.findIndex((layer) => layer.refId === id && layerId === layer.ind);
    let targetAssetIndex = assets.findIndex((asset) => asset.refId === id || asset.id === id);
    let targetLayer = layers[targetLayerIndex];
    let targetAssets = assets[targetAssetIndex];
    if (cur.layers) {
      cur.layers.forEach((layer) => {
        layer.parent = targetLayer.ind;
        layer.ind += targetLayer.ind;
        layer.level = targetLayer.level + 1;
      });
      layers = layers.concat(cur.layers);
    }
    // 更新动画模式
    targetLayer.ty = LayerTypeEnum.image;
    targetLayer.refId = targetLayer.refId || targetAssets.layers[0].refId;
    targetLayer.ks = targetLayer.ks || targetAssets.layers[0].ks;
    return this.buildAssetsModal(layers);
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

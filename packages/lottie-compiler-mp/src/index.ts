/**
 * @author 惠嘉伟
 * @email huijiawei@meituan.com
 * @create date 2021-05-19 17:37:31
 * @modify date 2021-05-19 17:37:31
 * @desc Miniprogram compiler
 */

import CoreParser from "@wmfe/lottie-compiler-core";
import isEqual from "./utils/is-equal";
import { buildAnimeList, buildTransformStyle } from "./utils/utils";
import CSSParser from "./CSSParser";
import HTMLParser from "./HTMLParser";

interface MpCompilerClass {
  request: any;
  json: Object | string;
  options: MpCompilerOptions;
}

enum MpCompilerMode {
  CSS = "css",
  ANIMATE = "animate",
}
interface MpCompilerOptions {
  duration?: number;
  infinite?: boolean;
  fullFrames?: boolean;
}

class MpCompiler implements MpCompilerClass {
  mode: keyof MpCompilerMode;
  request: any;
  json: string | Object;
  options: MpCompilerOptions;
  domInstance: HTMLParser;
  animeInstance: CSSParser;

  constructor(config) {
    const { request, options, mode } = config;
    this.mode = mode;
    this.options = {
      ...options,
      fullFrames: (options && options.fullFrames),
    };
    this.request = request;
  }

  parseByJson(json) {
    this.json = json;
    return this.parseMPCode();
  }

  parseByUrl(url) {
    return new Promise((resolve, reject) => {
      if (this.request) {
        this.request(url).then((json) => {
          this.json = json;
          const res = this.parseMPCode();
          return resolve(res);
        });
      }
    });
  }

  parseMPCode() {
    // @ts-ignore
    const coreInstance = new CoreParser({
      json: this.json,
    });
    const sourceJSON = coreInstance.outputJSON();
    const commonTree = this.buildCommonTree(sourceJSON);
    this.buildInstance(commonTree);
    switch (this.mode) {
      case MpCompilerMode.CSS:
        return this.buildMPCssCode();
      case MpCompilerMode.ANIMATE:
        return this.buildMPAnimateCode();
      default:
        break;
    }
  }

  buildCommonTree(json) {
    const res = {};
    const { name, startFrame, endFrame, frame, layer } = json;
    res["duration"] = (this.options && this.options.duration !== undefined) ? this.options.duration : Number((endFrame - startFrame) / frame);
    res["_name"] = name;
    this.rebuildLayerList(layer, res);
    return res;
  }

  rebuildLayerList(json, res) {
    let index = 0;
    const traverse = (source, json) => {
      if (!json) return;
      const { type, id, width, height, children, path, layer, name } = json;
      source["_index"] = index;
      source["_id"] = `AELayer-${index++}`;
      source["type"] = type;
      source["_name"] = source["_name"] || name || id;
      source["id"] = id || "root";
      source["styles"] = {
        width,
        height,
      };
      if (children) {
        source["children"] = [];
        children.forEach((child, index) => {
          source.children.push(traverse({}, child));
        });
      }
      if (path) {
        source["url"] = path;
      }
      if (layer && Object.keys(layer).length) {
        const { attributes, animeFrames } = layer;
        const {
          position,
          anchor,
          opacity = 1,
          scale,
          rotate,
          ...rest
        } = attributes;
        source["styles"] = {
          ...source["styles"],
          ...rest,
          left: position[0] - anchor[0],
          top: position[1] - anchor[1],
          transformOrigin: `${(anchor[0] / width) * 100}% ${(anchor[1] /
            height) *
            100}%`,
          opacity,
          ...buildTransformStyle({
            scale,
            rotate,
          }),
        };
        source['frameOptions'] = {
          frame: layer.frame,
          totalFrames: layer.totalFrames,
          initialFramePoint: layer.initialFramePoint,
          finalFramePoint: layer.finalFramePoint,
        } 
        source["animeList"] = buildAnimeList(animeFrames, attributes);
      }
      return source;
    };
    return traverse(res, json);
  }

  buildInstance(tree) {
    this.animeInstance = new CSSParser({
      tree,
      ctx: this,
    });
    this.domInstance = new HTMLParser(this.animeInstance.getAnimeTree());
  }

  buildMPCssCode() {
    const domContent = this.domInstance.buildHTMLContent();
    const cssContent = this.animeInstance.buildCSSContent();
    return {
      domContent,
      cssContent,
    };
  }

  buildMPAnimateCode() {
    const animeTree = this.animeInstance.getAnimeTree();
    const domTree = this.domInstance.getHTMLTree();
    const frames = this.buildAnimateFrames(animeTree);
    return {
      domTree,
      frames,
    };
  }

  buildAnimateFrames(tree) {
    const res = {};
    const transform = (source) => {
      if (source.keyFramesList) {
        const { baseStyles, duration = 0 } = source;
        res[source._id] = {
          styles: baseStyles,
          frames: this.rebuildKeyFrames(source.keyFramesList),
          duration,
        }
      }
      if (source.children) {
        source.children.forEach((item) => {
          return transform(item);
        });
      }
    };
    transform(tree);
    return res;
  }

  rebuildKeyFrames(keyframes) {
    let res = [];
    Object.keys(keyframes).map((key) => {
      let offset = this.fix(Number(key.split("%")[0]) / 100, 4);
      const { transform, ...rest } = keyframes[key];
      let tranformAttrs = this.rebuildTranformAttrs(transform);
      return res.push({
        offset,
        ...rest,
        ...tranformAttrs,
      });
    });
    return res;
  }

  rebuildTranformAttrs(str) {
    let attr = {};
    if (str.indexOf("translate3D") >= 0) {
      let translateReg = str.match(/translate3D\(([^\)]+)\)/);
      attr["translate3d"] = translateReg[1].split(",");
    }
    if (str.indexOf("scale3D") >= 0) {
      let scaleReg = str.match(/scale3D\(([^\)]+)\)/);
      attr["scale3d"] = scaleReg[1].split(",");
    }
    if (str.indexOf("rotate") >= 0) {
      let rotateReg = str.match(/rotate\(([^d]+)deg\)/);
      attr["rotate"] = Number(rotateReg[1]);
    }
    return attr;
  }

  fix(num, points) {
    return Number(Number(num).toFixed(points));
  }
}

export default MpCompiler;

/**
 * @author 惠嘉伟
 * @email huijiawei@meituan.com
 * @create date 2021-05-19 17:37:31
 * @modify date 2021-05-19 17:37:31
 * @desc Miniprogram compiler
 */

import CoreParser from '@bodymovin-parser/compiler-core';
import isEqual from './utils/is-equal';
import { buildAnimeList, buildTransformStyle } from './utils/utils';
import CSSParser from './CSSParser';
import HTMLParser from './HTMLParser';


interface MpCompilerClass {
    mode: typeof MpCompilerMode;
    request: any;
    hooks: {[x: string]: () => {}};
    json: Object | string;
    options: MpCompilerOptions;
}

enum MpCompilerMode {
    CSS = 'css',
    ANIMATE = 'animate',
}
interface MpCompilerOptions {
    mode: keyof MpCompilerMode;
}

class MpCompiler implements MpCompilerClass {

    mode: typeof MpCompilerMode;
    request: any;
    hooks: { [x: string]: () => {}; };
    json: string | Object;
    options: MpCompilerOptions;

    constructor(config) {
        const { request, hooks, options } = config;
        this.options = options;
        this.request = request;
        this.hooks = hooks;
    }

    parseByJson(json) {
        this.json = json;
        this.parseMPCode();
    }

    parseByUrl(url) {
        return new Promise((resolve, reject) => {
            if (this.request) {
                this.request(url).then((json) => {
                    this.json = json
                    const res = this.parseMPCode();
                    return resolve(res);
                })
            }
        })
        
    }

    parseMPCode() {
        const { mode } = this.options;
        // @ts-ignore
        const coreInstance = new CoreParser({
            json: this.json,
        });
        const sourceJSON = coreInstance.outputJson();
        const commonTree = this.buildCommonTree(sourceJSON);
        switch (mode) {
            case MpCompilerMode.CSS:
                return this.buildMPCssCode(commonTree);
            case MpCompilerMode.ANIMATE:
                return this.buildMPAnimateCode(commonTree);
            default:
                break;
        }
    }

    buildCommonTree(json) {
        const res = {};
        const { name, startframe, endframe, frame, layer } = json;
        res['duration'] = Number((endframe - startframe) / frame);
        res['_name'] = name;
        this.rebuildLayerList(layer, res);
        return res;
    }

    rebuildLayerList(json, res) {
        let index = 0;
        const traverse = (source, json) => {
            if (!json) return;
            const { type, id, width, height, children, path, layer, name} = json;
            source['type'] = type;
            source['_name'] = source['_name'] || (name || id);
            source['id'] = id || 'root';
            source['styles'] = {
                width,
                height,
            }
            source['_index'] = index;
            source['_id'] = `AElayer-${index++}`;
            if (children) {
                source['children'] = [];
                children.forEach((child, index) => {
                    source.children.push(traverse({}, child))
                })
            }
            if (path) {
                source['url'] = path;
            }
            if (layer && Object.keys(layer).length) {
                const {attributes, animeFrames} = layer;
                const { position, anchor, opacity = 1, scale, rotate, ...rest } = attributes;
                source['styles'] = {
                    ...source['styles'],
                    ...rest,
                    left: position[0] - anchor[0],
                    top: position[1] - anchor[1],
                    transformOrigin: `${(anchor[0] / width) * 100}% ${(anchor[1] / height) * 100}%`,
                    opacity,
                    ...buildTransformStyle({
                        scale,
                        rotate
                    }),
                }
                source['animeList'] = buildAnimeList(animeFrames, attributes);
            }
            return source;
        }
        return traverse(res, json);
    }

    buildMPCssCode(tree) {
        const cssInstance = this.getCssParserInstance(tree);
        const animeTree = cssInstance.getAnimeTree();
        const domContent = this.buildDOMTree(animeTree);
        const cssContent = cssInstance.buildCSSContent();
        return {
            domContent,
            cssContent,
        };
    }

    getCssParserInstance(tree) {
        const animeInstance = new CSSParser(tree);
        return animeInstance;
    }

    buildDOMTree(tree) {
        const domInstance = new HTMLParser(tree);
        return domInstance.buildHTMLContent();
    }

    buildMPAnimateCode(commonTree) {
        const cssInstance = this.getCssParserInstance(commonTree);
        const animeTree = cssInstance.getAnimeTree();
        const domContent = this.buildDOMTree(animeTree);
        const cssContent = this.buildAnimateFrames(animeTree);
        return {
            domContent,
            cssContent,
        };
    }

    buildAnimateFrames(tree) {
        const res = {};
        const transform = (source) => {
            if (source.keyFramesList) {
                const { baseStyles, imageClassName, imageUrl } = source;
                res[source.id] = {
                    styles: {
                        ...baseStyles,
                        imageClassName,
                        imageUrl,
                    },
                    frames: this.rebuildKeyFrames(source.keyFramesList),
                }
            }
            if (source.children) {
                source.children.forEach((item) => {
                    return transform(item);
                })
            }
        }
        transform(tree);
        return res;
    }

    rebuildKeyFrames(keyframes) {
        let res = [];
        Object.keys(keyframes).map((key) => {
            let offset = this.fix(Number(key.split('%')[0]) / 100, 4);
            const { transform, ...rest }  = keyframes[key];
            let tranformAttrs = this.rebuildTranformAttrs(transform);
            return res.push({
                offset,
                ...rest,
                ...tranformAttrs,
            })
        })
        res = this.filterFrames(res);
        return res;
    }

    rebuildTranformAttrs(str) {
        let attr = {};
        if (str.indexOf('translate3D') >= 0) {
            let translateReg = str.match(/translate3D\(([^\)]+)\)/);
            attr['translate3d'] = translateReg[1].split(',');
        }
        if (str.indexOf('scale3D') >= 0) {
            let scaleReg = str.match(/scale3D\(([^\)]+)\)/);
            attr['scale3d'] = scaleReg[1].split(',');
        }
        if (str.indexOf('rotate') >= 0) {
            let rotateReg = str.match(/rotate\(([^d]+)deg\)/);
            attr['rotate'] = Number(rotateReg[1]);
        }
        return attr;
    }

    filterFrames(frames) {
        return frames.reduce((prev, next) => {
            if (!prev.length) {
                return [...prev, next];
            } else {
                let last = prev[prev.length - 1];
                if (!isEqual(last, next, ['offset']) && next.offset !== 1) {
                    return [...prev, next];
                } else if (isEqual(last, next, ['offset']) && next.offset === 1) {
                    let cache = [...prev];
                    let previtem = cache.pop();
                    previtem.offset = 1;
                    return [...cache, previtem];
                } else {
                    return prev;
                }
            }
        }, [])
    }

    fix(num, points) {
        return Number(Number(num).toFixed(points));
    }


}

export default MpCompiler;
/**
 * @author 惠嘉伟
 * @email huijiawei@meituan.com
 * @create date 2021-05-19 17:37:31
 * @modify date 2021-05-19 17:37:31
 * @desc Miniprogram compiler
 */

import ParserCore from '@bodymovin-parser/compiler-core';
import './index.d';
import { buildAnimeList, buildTransformStyle } from './utils/utils';

class MpCompiler implements MpCompilerNS.MpCompilerClass {

    mode: typeof MpCompilerNS.MpCompilerMode;
    request: any;
    hooks: { [x: string]: () => {}; };
    json: string | Object;
    options: MpCompilerNS.MpCompilerOptions;

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
        if (this.request) {
            this.request(url).then((json) => {
                this.json = json
                this.parseMPCode();
            })
        }
    }

    parseMPCode() {
        const { mode } = this.options;
        const coreInstance = new ParserCore({
            json: this.json,
        });
        const sourceJSON = coreInstance.outputJson();
        const commonTree = this.buildCommonTree(sourceJSON);
        switch (mode) {
            case MpCompilerNS.MpCompilerMode.CSS:
                return this.buildMPCssCode(commonTree);
            case MpCompilerNS.MpCompilerMode.ANIMATE:
                return this.buildMPAnimateCode(commonTree);
            default:
                break;
        }
    }

    buildCommonTree(json) {
        const res = {};
        const { name, startframe, endframe, frame, layer, id } = json;
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
            source['_name'] = name || id;
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
        const domTree = this.buildDOMTree(tree);
        const cssTree = this.buildCSSTree(tree);
        this.outputCSSCode({
            domTree,
            cssTree,
        });
    }

    buildDOMTree(tree) {

    }

    buildCSSTree(tree) {

    }
    
    outputCSSCode({
        domTree,
        cssTree,
    }) {
        const domContent = this.buildDOMContent(domTree);
        const cssContent = this.buildCSSContent(cssTree);
    }

    buildDOMContent(dom) {
        return '';
    }

    buildCSSContent(css) {
        return '';
    }



    buildMPAnimateCode(tree) {
        const coreInstance = new ParserCore({
            json: this.json,
        });
        const sourceJSON = coreInstance.outputJson();
    }


}

export default MpCompiler;
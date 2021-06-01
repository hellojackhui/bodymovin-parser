import CoreParser from '@bodymovin-parser/compiler-core';
import HTMLParser from './html/html-parser';
import CSSParser from './css/css-parser';
import TreeBuilder from './TreeBuilder';

class WebBMParser {
    public fetch: any;
    public json: any;
    public parser: any;
    public _config: any;
    private domParserInstance: HTMLParser;
    private cssParserInstance: CSSParser;

    constructor({
        requestFn,
        config,
        json = {},
    }) {
        this.fetch = requestFn || fetch;
        this._config = config;
        this.json = json;
    }

    buildCommonTree(json) {
        const res = {};
        const { name, startframe, endframe, frame, layer, id } = json;
        res['duration'] = Number((endframe - startframe) / frame);
        res['_name'] = name;
        res['maskList'] = [];
        this.rebuildLayer(layer, res);
        return res;
    }

    rebuildLayer(json, res) {
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
            source['_id'] = `AELayer-${index++}`;
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
                    ...this.buildTransformStyle({
                        scale,
                        rotate
                    }),
                }
                source['animeList'] = this.buildAnimeList(animeFrames, attributes);
                if (layer.maskList) {
                    res['maskList'] = [
                        ...res['maskList'],
                        ...layer.maskList,
                    ]
                    source['hasMask'] = true;
                    source['maskList'] = layer.maskList;
                }
            }
            return source;
        }
        return traverse(res, json);
    }

    getParserInstance(tree) {
        this.domParserInstance = new HTMLParser(tree);
        this.cssParserInstance = new CSSParser(tree);
    }

    getWebCommonTree(tree) {
        const ast = this.buildCommonTree(tree);
        const animeTree = new TreeBuilder(ast).getAnimeTree();
        return animeTree;
    }

    parseByJson(json) {
        this.parser = new CoreParser({json});
        const outputJSON = this.parser.outputJson();
        const res = this.parseToCode(outputJSON);
        return res;
    }

    parseByUrl(url) {
        return new Promise((resolve, reject) => {
            if (this.fetch) {
                this.fetch(url).then((json) => {
                    // @ts-ignore
                    this.parser = new CoreParser({json});
                    const outputJSON = this.parser.outputJson();
                    const res = this.parseToCode(outputJSON);
                    return resolve(res);
                }).catch((e) => {
                    console.log('error');
                    return reject('error');
                })
            }
        })
    }

    parseToCode(json) {
        // 重新生成ast
        // 基于新ast生成dom树和css树
        // dom生成输出字符串，css生成输出字符串。
        // 适配文件输出。
        const { mode } = this._config;
        const webTree = this.getWebCommonTree(json);
        this.getParserInstance(webTree);
        switch (mode) {
            case 'html':
                return this.generateAnimeCode();
            case 'style':
                break;
            default:
                break;
        }
        return;
    }

    buildAnimeList(list, attributes) {
        const res = {};
        const { width, height, opacity, anchor, ...rest} = attributes;
        list.map((item) => {
            res[`${Number((Number(item.offset) * 100).toFixed(3))}%`] = {
                ...rest,
                ...item,
            };
        });
        return res;
    }

    generateAnimeCode() {
        const domContent = this.domParserInstance.buildHTMLContent();
        const cssContent = this.cssParserInstance.buildCSSContent();
        return {
            domContent,
            cssContent,
        }
    }    
    
    buildTransformStyle(styles) {
        const { scale, rotate } = styles;
        let template = 'scale3d({{scale}}) rotate({{rotate}}deg)';
        let scaleStr = Array.isArray(scale) ? `${scale[0]}, ${scale[1]}, ${scale[2]}` : `${scale.x}, ${scale.y}, ${scale.z}`;
        template = template.replace(/\{\{scale\}\}/, scaleStr);
        template = template.replace(/\{\{rotate\}\}/, `${rotate}`);
        return {
            transform: template,
        };
    }

}

export default WebBMParser;
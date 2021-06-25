import CoreParser from '@bodymovin-parser/compiler-core';
import HTMLParser from './html/html-parser';
import CSSParser from './css/css-parser';
import TreeBuilder from './TreeBuilder';
import { isBase64 } from './utils/utils';


interface IAnimeConfig {
    mode: 'linear' | 'ease' | 'auto' | 'steps(1)';
    iterationCount: number;
    direction: 'normal' | 'alternate';
    fillMode: 'none' | 'forwards' | 'backwards' | 'none' | 'both' | 'initial' | 'inherit';
}
interface IWebBMParserConfig {
    assetsOrigin?: string;
    animeConfig: IAnimeConfig;
}

class WebBMParser {
    public fetch: any;
    public json: JSON;
    public parser: any;
    public config: IWebBMParserConfig;
    private domParserInstance: HTMLParser;
    private cssParserInstance: CSSParser;
    private parserTree: any;

    constructor({
        requestFn,
        config,
        json,
    }) {
        this.fetch = requestFn || fetch;
        this.config = this.buildConfig(config);
        this.json = json;
        this.parserTree = this.getParserTree(this.json);
    }

    buildConfig(config) {
        return {
            ...config,
            animeConfig: {
                mode: (config.animeConfig && config.animeConfig.mode) ? config.animeConfig.mode : 'steps(1)',
                iterationCount: (config.animeConfig && config.animeConfig.iterationCount) ? config.animeConfig.iterationCount : 'infinite',
                direction: (config.animeConfig && config.animeConfig.direction) ? config.animeConfig.direction : 'normal',
                fillMode: (config.animeConfig && config.animeConfig.fillMode) ? config.animeConfig.fillMode : 'none',
            }
        }
    }

    buildCommonTree(json) {
        const res = {};
        const { name, startFrame, endFrame, frame, layer, id } = json;
        res['duration'] = Number((endFrame - startFrame) / frame);
        res['_name'] = name;
        res['maskList'] = [];
        this.rebuildLayer(layer, res);
        return res;
    }

    getParserTree(json) {
        if (!json) return;
        this.parser = new CoreParser({json});
        const outputJSON = this.parser.outputJSON();
        const parserTree = this.getWebCommonTree(outputJSON);
        this.getParserInstance(parserTree);
        return parserTree;
    }

    rebuildLayer(json, res) {
        let index = 0;
        const traverse = (source, json) => {
            if (!json) return;
            const { type, id, width, height, children, path, layer, name, shapeSource} = json;
            const { assetsOrigin = '' } = this.config;
            source['type'] = type;
            source['_name'] = name || id;
            source['id'] = id || 'root';
            source['styles'] = {
                width,
                height,
            }
            source['_index'] = index;
            source['_id'] = `AELayer-${index++}`;
            if (path) {
                source['url'] = isBase64(path) ? path : `${assetsOrigin}${path}`;
            }
            if (layer && Object.keys(layer).length) {
                const {attributes, animeFrames, animeOptions} = layer;
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
                    source['animeOptions'] = animeOptions;
                }
            }
            if (shapeSource) {
                source['shapeSource'] = shapeSource;
            }
            if (children && children.length) {
                source['children'] = [];
                children.forEach((child, index) => {
                    source.children.push(traverse({}, child))
                })
            }
            return source;
        }
        return traverse(res, json);
    }

    getParserInstance(tree) {
        this.domParserInstance = new HTMLParser({
            source: tree,
            ctx: this,
        });
        this.cssParserInstance = new CSSParser({
            source: tree,
            ctx: this,
        });
    }

    getWebCommonTree(tree) {
        const ast = this.buildCommonTree(tree);
        const animeTree = new TreeBuilder({
            source: ast,
            ctx: this,
        }).getAnimeTree();
        return animeTree;
    }

    parseByJson(json) {
        if (!this.json && json) {
            this.json = json;
            this.parserTree = this.getParserTree(this.json);
        }
        const res = this.generateAnimeCode();
        return res;
    }

    parseByUrl(url) {
        return new Promise((resolve, reject) => {
            if (this.fetch) {
                this.fetch(url).then((json) => {
                    // @ts-ignore
                    this.parserTree = this.getParserTree(json);
                    const res = this.generateAnimeCode();
                    return resolve(res);
                }).catch((e) => {
                    console.log('error');
                    return reject('error');
                })
            }
        })
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

    outputJSON() {
        return this.json;
    }

    outputDOMTree() {
        return this.domParserInstance.getHTMLTree();
    }

    outputCSSTree() {
        return this.parserTree;
    }

}

export default WebBMParser;
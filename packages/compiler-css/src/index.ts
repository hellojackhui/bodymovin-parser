import ParserCore from '@bodymovin-parser/compiler-core';
import HTMLParser from './html/html-parser';
import CSSParser from './css/css-parser';
import { camelCaseToAttrs, isCamelCase } from './utils/camel';

class ParserToCSS {
    public fetch: any;
    public json: any;
    public parser: any;
    public _config: any;

    constructor({
        requestFn,
        config,
        json = {},
    }) {
        this.fetch = requestFn || fetch;
        this._config = config;
        this.json = json;
    }

    parseByJson(json) {
        this.parser = new ParserCore({json});
        // console.log(JSON.stringify(this.parser.outputJson()))
    }

    parseByFetch(url) {
        if (this.fetch) {
            this.fetch(url).then((json) => {
                this.parser = new ParserCore({json});
                const outputJSON = this.parser.outputJson();
                this.parseAst(outputJSON);
            })
        }
    }

    parseAst(json) {
        // 重新生成ast
        // 基于新ast生成dom树和css树
        // dom生成输出字符串，css生成输出字符串。
        // 适配文件输出。
        const { mode } = this._config;
        const astTree = this.rebuildAst(json);
        const animeTree = this.buildAnimeTree(astTree);
        switch (mode) {
            case 'anime':
                this.generateAnimeCode({
                    tree: animeTree
                });
                break;
            case 'style':
                break;
            default:
                break;
        }

    }

    rebuildAst(json) {
        const res = {};
        const { name, startframe, endframe, frame, layer, id } = json;
        res['duration'] = Number((endframe - startframe) / frame);
        res['_name'] = name;
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
                const { position, rotate, anchor, scale, opacity } = attributes;
                source['styles'] = {
                    ...source['styles'],
                    left: position[0] - anchor[0],
                    top: position[1] - anchor[1],
                }
                source['animeList'] = this.buildAnimeList(animeFrames, attributes);
            }
            return source;
        }
        return traverse(res, json);
    }

    buildAnimeTree(tree) {
        const animeInstance = new CSSParser(tree);
        return animeInstance.getAnimeTree();
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

    buildDOMTree(tree) {
        const animeInstance = new HTMLParser(tree);
        return animeInstance.getHTMLTree();
    }

    buildCSSContent(tree) {
        let res = '';
        const traverse = (tree, baseString) => {
            const { 
                _id, 
                baseClassName, 
                baseStyles, 
                imageClassName, 
                imageUrl,
                animeClassName, 
                animation,
                keyFramesName,
                keyFramesList,
                children, } = tree;
            if (baseClassName) {
                let classStr = this.buildClassString(baseClassName, baseStyles);
                baseString += `${classStr}\n`;
            }
            if (imageClassName) {
                let classStr = this.buildBgString(imageClassName, imageUrl);
                baseString += `${classStr}\n`;
            }
            if (animeClassName) {
                let classStr = this.buildClassString(animeClassName, animation);
                baseString += `${classStr}\n`;
            }
            if (keyFramesName) {
                let classStr = this.buildKeyFramesString(keyFramesName, keyFramesList);
                baseString += `${classStr}\n`;
            }
            if (children) {
                children.forEach((child) => {
                    baseString += traverse(child, '');
                })
            }
            return baseString;
        }
        res = traverse(tree, res);
        return res;
    }

    buildDOMContent(tree) {
        let template = '<div {{attributes}}>{{slot}}</div>'
        let res = '';
        const traverse = (obj, str) => {
            if (!obj) return str;
            const {children, _id, ...rest} = obj;
            let attrs = Object.keys(rest).map((key) => {
                return `${key}="${obj[key]}"`;
            });
            let attributes = attrs.join(' ');
            let tmp = template.replace(/\{\{attributes\}\}/, attributes);
            if (children) {
                let childs = obj.children.map((child) => {
                    return traverse(child, '');
                })
                tmp = tmp.replace(/\{\{slot\}\}/, childs.join(' '));
            } else {
                tmp = tmp.replace(/\{\{slot\}\}/, '');
            }
            return tmp;
        }
        res = traverse(tree, res);
        return res;
    }

    generateAnimeCode({
        tree,
    }) {
        const domTree = this.buildDOMTree(tree);
        const domContent = this.buildDOMContent(domTree);
        const cssContent = this.buildCSSContent(tree);
        console.log('domContent', cssContent);
    }

    buildClassString(className, styles) {
        let cssTemplate = '.{{className}} {{{content}}}';
        let classString = cssTemplate.replace(/\{\{className\}\}/, className);
        let attrs = Object.keys(styles).map((key) => {
            if (isCamelCase(key)) {
                let camelKey = camelCaseToAttrs(key);
                return `${camelKey}: ${styles[key]};`;
            } else {
                return `${key}: ${styles[key]};`;
            }
        })
        classString = classString.replace(/\{\{content\}\}/, attrs.join(' '));
        return classString;
    }

    buildBgString(className, url) {
        let cssTemplate = '.{{className}} {{{content}}}';
        let classString = cssTemplate.replace(/\{\{className\}\}/, className);
        classString = classString.replace(/\{\{content\}\}/, `background-image: url('${url}')`);
        return classString;
    }

    buildKeyFramesString(keyFramesName, keyFramesList) {
        let keyframesTemplate = '@keyframes {{kfname}} {{{framelist}}}';
        let kfString = keyframesTemplate.replace(/\{\{kfname\}\}/, keyFramesName);
        let framelist = Object.keys(keyFramesList).map((key) => {
            return `${key} {${this.formatKeyFrames(keyFramesList[key])}}`
        })
        kfString = kfString.replace(/\{\{framelist\}\}/, framelist.join(' '));
        return kfString;
    }

    formatKeyFrames(styles) {
        let res = [];
        Object.keys(styles).forEach((key) => {
            let str = `${key}: ${styles[key]}`;
            res.push(str);
        });
        return res.join(' ');
    }
    
}

export default ParserToCSS;
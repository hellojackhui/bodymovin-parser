import ParserCore from '@bodymovin-parser/compiler-core';
import HTMLParser from './html/html-parser';
import CSSParser from './css/css-parser';

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
                console.log('ParserCore', ParserCore);
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
        const astTree = this.rebuildAst(json);
        const animeTree = this.buildAnimeTree(astTree);
        const domTree = this.buildDOMTree(astTree);
        console.log('domTree', domTree);
        // const cssContent = this.buildCSSContent(animeTree);
        // const domContent = this.buildDOMContent(domTree);

    }

    rebuildAst(json) {
        const res = {};
        const { name, startframe, endframe, frame, layer } = json;
        res['name'] = name;
        res['duration'] = Number((endframe - startframe) / frame);
        this.rebuildLayer(layer, res);
        return res;
    }

    rebuildLayer(json, res) {
        let index = 0;
        const traverse = (source, json) => {
            if (!json) return;
            const { type, id, width, height, children, path, layer} = json;
            source['type'] = type;
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
        return '';
    }

    buildDOMContent(tree) {
        return '';
    }
    
}

export default ParserToCSS;
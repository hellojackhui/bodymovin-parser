import { isCamelCase, camelCaseToAttrs } from "../utils/camel";

class HTMLParser {

    layerJson: any;
    ast: object;
    _id: number;
    htmlStr: string;
    htmlTree: any;
    maskTree: any;

    constructor(layer) {
        this.layerJson = layer;
        this.htmlTree = this.buildHtmlTree(layer);
        this.maskTree = this.buildMaskTree(layer);
        this._id = 1;
    }

    buildHtmlTree(layerjson) {
        if (!layerjson) return null;
        const tree = {};
        const traverse = (json, tree) => {
            if (!json) return;
            const {type, _name, _id, baseClassName = '', imageClassName = '', animeClassName = '', children} = json;
            tree['_id'] = _id;
            tree['type'] = type;
            tree['class'] = [baseClassName, imageClassName, animeClassName].join(' ').replace(/([\s]+)(\s*)$/, '$2');
            tree['aelayerName'] = _name || 'root';
            if (children) {
                tree['children'] = [];
                children.reverse().forEach(child => {
                    tree['children'].push(traverse(child, {}));
                });
            }
            return tree;
        }
        traverse(layerjson, tree);
        return tree;
    }

    buildMaskTree(layerjson) {
        if (!layerjson.maskContent || !layerjson.maskContent.length) return null;
        const tree = {
            type: 'svg',
            width: 1,
            height: 1,
            style: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                display: 'block',
                transformOrigin: '0px 0px', 
                backfaceVisibility: 'visible', 
                transformStyle: 'preserve-3d',
            },
            children: [
                {
                    type: 'def',
                    children: layerjson.maskContent,
                }
            ],
        };
        return tree;
    }

    buildHTMLContent() {
        let domContent = this.buildDOMContent();
        let svgContent = this.buildSVGContent();
        let template = '<div style="width:100%;height:100%;background-color:#333;" id="magic-demo">{{svg}}{{dom}}</div>';
        template = template.replace(/\{\{svg\}\}/, svgContent);
        template = template.replace(/\{\{dom\}\}/, domContent);
        return template;
    }

    buildDOMContent() {
        if (!this.htmlTree) return '';
        let template = '<div {{attributes}}>{{slot}}</div>';
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
                let childs = obj.children.reverse().map((child) => {
                    return traverse(child, '');
                })
                tmp = tmp.replace(/\{\{slot\}\}/, childs.join(' '));
            } else {
                tmp = tmp.replace(/\{\{slot\}\}/, '');
            }
            return tmp;
        }
        res = traverse(this.htmlTree, res);
        return res;
    }

    buildSVGContent() {
        if (!this.maskTree) return '';
        let svgTemplate = '<svg {{attributes}} style="{{styles}}">{{slot}}</svg>';
        const {type, width, height, style, children} = this.maskTree;
        if (type === 'svg') {
            const attrs = {width, height};
            let attrsArr = Object.keys(attrs).map((key) => {
                return `${isCamelCase(key) ? camelCaseToAttrs(key) : key}=${attrs[key]}px`;
            });
            let attributes = attrsArr.join(' ');
            svgTemplate = svgTemplate.replace(/\{\{attributes\}\}/, attributes);
            let stylesArr = Object.keys(style).map((key) => {
                return `${isCamelCase(key) ? camelCaseToAttrs(key) : key}: ${style[key]};`;
            });
            let styles = stylesArr.join(' ');
            svgTemplate = svgTemplate.replace(/\{\{styles\}\}/, styles);
            if (children) {
                svgTemplate = svgTemplate.replace(/\{\{slot\}\}/, this.buildDefContent(children));
            } else {
                svgTemplate = svgTemplate.replace(/\{\{slot\}\}/, '');
            }
            
        } else {
            svgTemplate = '';
        }
        return svgTemplate;
    }

    buildDefContent(datas) {
        if (!datas || !datas.length) return '';
        return datas.map((data) => {
            let defTemplate = '<defs>{{slot}}</defs>';
            const { type, children } = data;
            if (type === 'def') {
                defTemplate = defTemplate.replace(/\{\{slot\}\}/, this.buildClipPathContent(children));
            } else {
                defTemplate = '';
            }
            return defTemplate;
        }).join(' ');
    }

    buildClipPathContent(datas) {
        if (!datas || !datas.length) return '';
        return datas.map((data) => {
            let defTemplate = '<clipPath {{attributes}}>{{slot}}</clipPath>';
            const { type, id, children } = data;
            if (type === 'clipPath') {
                defTemplate = defTemplate.replace(/\{\{attributes\}\}/, `id="${id}"`);
                defTemplate = defTemplate.replace(/\{\{slot\}\}/, this.buildPathContent(children));
            } else {
                defTemplate = '';
            }
            return defTemplate;
        }).join(' ');
    }

    buildPathContent(datas) {
        if (!datas || !datas.length) return '';
        return datas.map((data) => {
            let clipPathTemplate = '<path {{attributes}}></path>';
            const { type, ...rest } = data;
            if (type === 'path') {
                let attrsArr = Object.keys(rest).map((key) => {
                    return `${isCamelCase(key) ? camelCaseToAttrs(key) : key}="${rest[key]}"`;
                });
                let attributes = attrsArr.join(' ');
                clipPathTemplate = clipPathTemplate.replace(/\{\{attributes\}\}/, attributes);
            } else {
                clipPathTemplate = '';
            }
            return clipPathTemplate;
        }).join(' ');
        
    }

    getHTMLTree() {
        return this.htmlTree;
    }

}

export default HTMLParser;
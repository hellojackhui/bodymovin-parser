import { isCamelCase, camelCaseToAttrs } from "../utils/camel";

class HTMLParser {

    layerJSON: any;
    ast: object;
    _id: number;
    htmlStr: string;
    htmlTree: any;
    maskTree: any;

    constructor({
        source,
        ctx,
    }) {
        this.layerJSON = source;
        this.htmlTree = this.buildHtmlTree(source);
        this.maskTree = this.buildMaskTree(source);
        this._id = 1;
    }
    
    outputJSON() {
        return this.layerJSON;
    }

    buildHtmlTree(layerJSON) {
        if (!layerJSON) return null;
        const tree = {};
        const traverse = (json, tree) => {
            if (!json) return;
            const { type, attrs, _name, _id, baseClassName = '', imageClassName = '', animeClassName = '', children, } = json;
            tree['_id'] = _id;
            tree['type'] = type;
            tree['class'] = [baseClassName, imageClassName, animeClassName].join(' ').replace(/([\s]+)(\s*)$/, '$2');
            tree['aeLayerName'] = _name || 'root';
            if (attrs) {
                Object.keys(attrs).forEach((key) => {
                    tree[key] = attrs[key]
                })
            }
            if (children) {
                tree['children'] = [];
                children.reverse().forEach(child => {
                    tree['children'].push(traverse(child, {}));
                });
            }
            return tree;
        }
        traverse(layerJSON, tree);
        return tree;
    }

    buildMaskTree(layerJSON) {
        if (!layerJSON.maskContent || !layerJSON.maskContent.length) return null;
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
                    children: layerJSON.maskContent,
                }
            ],
        };
        return tree;
    }

    buildHTMLContent() {
        let domContent = this.buildDOMContent();
        let svgContent = this.buildSVGContent();
        let template = '<div id="magic-demo">{{svg}}{{dom}}</div>';
        template = template.replace(/\{\{svg\}\}/, svgContent);
        template = template.replace(/\{\{dom\}\}/, domContent);
        return template;
    }

    buildDOMContent() {
        if (!this.htmlTree) return '';
        let template = '<{{node}} {{attributes}}>{{slot}}</{{node}}>';
        let res = '';
        const traverse = (obj, str) => {
            if (!obj) return str;
            const {type, children, _id, ...rest} = obj;
            let attrs = Object.keys(rest).map((key) => {
                return `${isCamelCase(key) ? camelCaseToAttrs(key) : key}="${obj[key]}"`;
            });
            let attributes = attrs.join(' ');
            let tmp = template.replace(/\{\{attributes\}\}/, attributes);
            tmp = tmp.replace(/\{\{node\}\}/g, this.getDomType(type));
            if (children) {
                let child = obj.children.reverse().map((child) => {
                    return traverse(child, '');
                })
                tmp = tmp.replace(/\{\{slot\}\}/, child.join(' '));
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

    buildDefContent(defData) {
        if (!defData || !defData.length) return '';
        return defData.map((data) => {
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

    buildClipPathContent(defData) {
        if (!defData || !defData.length) return '';
        return defData.map((data) => {
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

    buildPathContent(defData) {
        if (!defData || !defData.length) return '';
        return defData.map((data) => {
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

    getDomType(type) {
        switch (type) {
            case 'node':
            case 'image':
                return 'div';
            case 'img':
                return 'image';
            default:
                return type;
        }
    }

}

export default HTMLParser;
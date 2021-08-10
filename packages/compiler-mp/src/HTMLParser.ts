import { isCamelCase, camelCaseToAttrs } from "./utils/camel";

class HTMLParser {

    layerJson: any;
    ast: object;
    htmlStr: string;
    htmlTree: any;

    constructor(layer) {
        this.layerJson = layer;
        this.htmlTree = this.buildHtmlTree(layer);
    }

    buildHtmlTree(layerjson) {
        if (!layerjson) return null;
        const tree = {};
        const traverse = (json, tree) => {
            if (!json) return;
            const { type, attrs, _name, baseClassName = '', imageClassName = '', animeClassName = '', children, baseStyles, imageUrl, _id} = json;
            tree['_id'] = _id || 'root';
            tree['type'] = type;
            tree['class'] = [baseClassName, imageClassName, animeClassName].join(' ').replace(/([\s]+)(\s*)$/, '$2');
            tree['aelayerName'] = _name || 'root';
            tree['style'] = {
                ...baseStyles,
                backgroundImage: `url(${imageUrl || ''})`
            }
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
        traverse(layerjson, tree);
        return tree;
    }

    buildHTMLContent() {
        let domContent = this.buildDOMContent();
        let template = '<view id="magic-demo">{{dom}}</view>';
        template = template.replace(/\{\{dom\}\}/, domContent);
        return template;
    }

    buildDOMContent() {
        if (!this.htmlTree) return '';
        let template = '<{{node}} {{attributes}} style="{{style}}">{{slot}}</{{node}}>';
        let res = '';
        const traverse = (obj, str) => {
            if (!obj) return str;
            const {type, children, style, ...rest} = obj;
            let attrs = Object.keys(rest).map((key) => {
                return `${isCamelCase(key) ? camelCaseToAttrs(key) : key}="${obj[key]}"`;
            });
            let attributes = attrs.join(' ') || '';
            let tmp = template.replace(/\{\{attributes\}\}/, attributes);

            let styleattrs = Object.keys(style).map((key) => {
                return `${isCamelCase(key) ? camelCaseToAttrs(key) : key}: ${style[key]}; `;
            });
            let styleattributes = styleattrs.join(' ');
            tmp = tmp.replace(/\{\{style\}\}/, styleattributes);

            tmp = tmp.replace(/\{\{node\}\}/g, this.getDomType(type));
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

    getHTMLTree() {
        return this.htmlTree;
    }

    getDomType(type) {
        switch (type) {
            case 'node':
            case 'image':
                return 'view';
            case 'img':
                return 'image';
            default:
                return 'view';
        }
    }

}

export default HTMLParser;
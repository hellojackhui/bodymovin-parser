class HTMLParser {

    layerJson: any;
    ast: object;
    _id: number;
    htmlStr: string;
    htmlTree: any;

    constructor(layer) {
        this.layerJson = layer;
        this.htmlTree = this.buildHtmlTree(layer);
        this._id = 1;
    }

    buildHtmlTree(layerjson) {
        const tree = {};
        const traverse = (json, tree) => {
            if (!json) return;
            const {type, _name, _id, baseClassName = '', imageClassName = '', animeClassName = '', children} = json;
            tree['_id'] = _id;
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

    getHTMLTree() {
        return this.htmlTree;
    }

}

export default HTMLParser;
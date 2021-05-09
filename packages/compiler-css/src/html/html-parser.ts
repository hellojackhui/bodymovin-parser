class HTMLParser {

    layerJson: any;
    ast: object;
    _id: number;
    htmlStr: string;
    htmlTree: any;

    constructor(layer) {
        this.layerJson = layer;
        this.htmlTree = this.buildHtmlAST(layer);
        this._id = 1;
    }

    buildHtmlAST(layerjson) {
        const tree = {};
        const traverse = (json, tree) => {
            if (!json) return;
            const {type, id, children} = json;
            tree.type = type || id;
            tree._id = this._id++;
            if (children) {
                tree.children = [];
                for (let i = 0; i < children.length; i++) {
                    tree.children.push(traverse(children[i], {}));
                }
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
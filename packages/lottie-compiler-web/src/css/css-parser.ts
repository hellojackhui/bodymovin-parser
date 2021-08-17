
import { camelCaseToAttrs, isCamelCase } from '../utils/camel';

class CSSParser {

    public parseTree: object;

    constructor({
        source,
        ctx,
    }) {
        this.parseTree = source;
    }

    getAnimeTree() {
        return this.parseTree;
    }

    buildCSSContent() {
        let res = '';
        const traverse = (tree, baseString) => {
            const {
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
        res = traverse(this.parseTree, res);
        return res;
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
        let keyframesTemplate = '@keyframes {{kfName}} {{{frameList}}}';
        let kfString = keyframesTemplate.replace(/\{\{kfName\}\}/, keyFramesName);
        let frameList = Object.keys(keyFramesList).map((key) => {
            return `${key} {${this.formatKeyFrames(keyFramesList[key])}}`
        })
        kfString = kfString.replace(/\{\{frameList\}\}/, frameList.join(' '));
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

export default CSSParser;
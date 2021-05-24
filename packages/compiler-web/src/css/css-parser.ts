
import { camelCaseToAttrs, isCamelCase } from '../utils/camel';
import { buildClipPathTree } from '../utils/svgTools';
class CSSParser {

    private _tree: any;
    private _duration: number;
    private _baseRootStyles: object;
    public parseTree: object;
    private _baseChildStyles: object;

    constructor(tree) {
        this._tree = tree;
        this._duration = tree.duration;
        this._baseRootStyles = {
            display: 'block',
            overflow: 'hidden',
            position: 'relative',
            transformOrigin: '50.00% 0%',
            backfaceVisibility: 'visible',
            transform: `translate3D(0,0,0) scale(1,1)`,
            transformStyle: 'preserve-3d',
        }
        this._baseChildStyles = {
            display: 'block',
            position: 'absolute',
            transformStyle: 'preserve-3d',
        }
        this.parseTree = this.buildAnimeTree(tree);
    }

    buildAnimeTree(tree) {
        const res = {};
        const traverse = (tree, target) => {
            if (tree.id === 'root') {
                const { type, styles, children, id, _name, maskList} = tree;
                target['_id'] = id;
                target['_name'] = _name;
                target['type'] = type;
                target['baseClassName'] = `Layer_Composition`;
                target['baseStyles'] = this.formatStyles({
                    ...styles,
                    ...this._baseRootStyles,
                });
                target['maskContent'] = this.formatMaskContent(maskList);
                if (children) {
                    target['children'] = [];
                    children.reverse().forEach(child => {
                        target['children'].push(traverse(child, {}))
                    });
                }
            } else {
                const { type, styles, _id, _index, animeList, url, _name, children, hasMask = false} = tree;
                target['_id'] = _id;
                target['type'] = type;
                target['_name'] = _name;
                target['baseClassName'] = `Layer_${_index}`;
                target['baseStyles'] = this.formatStyles({
                    ...this._baseChildStyles,
                    ...styles,
                });
                if (url) {
                    target['imageClassName'] = `Layer_Bg${_index}`;
                    target['imageUrl'] = url;
                }
                if (animeList) {
                    target['animeClassName'] =  `Layer_Anim${_index}`;
                    target['animation'] = {
                        'animationName': `Layer_AnimKeys${_index}`,
                        'animationDuration': `${Number(this._duration.toFixed(3))}s`,
                        'animationDelay': '0.00s',
                        'animationTimingFunction': 'steps(1)',
                        'animationIterationCount': 'infinite',
                        'animationDirection': 'normal',
                        'animationFillMode': 'none'
                    }
                    target['keyFramesName'] = `Layer_AnimKeys${_index}`;
                    target['keyFramesList'] = this.getKeyFrames(animeList, target);
                }
                if (children) {
                    target['children'] = [];
                    children.reverse().forEach(child => {
                        target['children'].push(traverse(child, {}))
                    });
                }
                if (hasMask) {
                    target['type'] = 'svg';
                    target['children'] = this.buildGImageTree(tree.maskList, target);
                    if (target['imageClassName']) {
                        delete target['imageClassName'];
                    }
                }
            }
            return target;
        }
        traverse(tree, res);
        return res;
    }

    buildGImageTree = (maskdata, source) => {
        return maskdata.map((mask) => {
            return {
                type: 'g',
                attrs: {
                    clipPath: `url(#${mask._id})`,
                },
                children: [
                    {
                        type: 'img',
                        attrs: {
                            width: source.baseStyles.width,
                            height: source.baseStyles.height,
                            href: source.imageUrl,
                        }
                    }
                ]
            }
        })
    }

    getAnimeTree() {
        return this.parseTree;
    }

    buildCSSContent() {
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
        res = traverse(this.parseTree, res);
        return res;
    }

    getKeyFrames(list, source) {
        const res = {};
        if (!list || !Object.keys(list).length) return {};
        let p;
        Object.keys(list).map((key, index) => {
            let item = list[key];
            if (index === 0) {
                p = item.position;
            }
            res[key] = {};
            let transformStr = '';
            const {opacity, ...rest} = item;
            if (rest) {
                const { position, rotate, scale } = rest;
                if (position) {
                    const valX = this.fix(position[0] - p[0], 2);
                    const valY = this.fix(position[1] - p[1], 2);
                    const valZ = this.fix(position[2] - p[2], 2);
                    transformStr += `translate3D(${valX}px,${valY}px,${valZ}px) `
                }
                if (rotate) {
                    transformStr += `rotate(${this.fix(rotate, 2)}deg) `
                }
                if (scale) {
                    if (Array.isArray(scale)) {
                        transformStr += `scale3D(${scale[0]},${scale[1]},${scale[2]}) `
                    } else {
                        transformStr += `scale3D(${scale.x},${scale.y},${scale.z}) `
                    }
                }
                transformStr = transformStr.replace(/\s$/, '');
                transformStr += ';';
                res[key]['transform'] = transformStr;
            }
            if (opacity) {
                res[key]['opacity'] = this.fix(opacity, 2);
            }
            if (index === 0) {
                // 回写数据
                source.baseStyles = {
                    ...source.baseStyles,
                    opacity: this.fix(opacity == undefined ? 1 : opacity, 2),
                }
            }
        })
        return res;
    }

    formatStyles(styles) {
        let res = {};
        const formList = [
            'width',
            'height',
            'top',
            'left',
        ]
        Object.keys(styles).forEach((key) => {
            res[key] = formList.includes(key) ? `${styles[key]}px` : styles[key];
        });
        return res;
    }

    fix(num, point = 2) {
        return Number(Number(num).toFixed(point));
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

    formatMaskContent(maskList) {
        return maskList.map((mask, index) => {
            switch (mask.maskType) {
                case 'clipPath':
                    return buildClipPathTree(mask);
                default:
                    break;
            }
        })
    }

}

export default CSSParser;
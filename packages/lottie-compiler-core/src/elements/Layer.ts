import isAttribute from '../utils/isAttribute';
import { LayerTypeEnum, TypeEnum } from '../utils/constant';
import { parseExpression } from '../utils/expression';
import {
    buildOpacityFrames,
    buildRotateFrames,
    buildScaleFrames,
    buildPositionFrames,
} from './Frames';
import Mask from './Mask';


class Layer {

    frame: number;
    frames: number; 
    index: any;
    id: any;
    type: string;
    name: string;
    layer: any;
    _level: number;
    _startFrame: number;
    _initialFramePoint: number;
    _finalFramePoint: number;
    _startTime: number;
    attributes: {};
    animeFrames: any[];
    parentId: string;
    _unionId: string;
    _options: any;
    _effects: object;
    animeOptions: object;
    maskList: Array<any>;

    constructor(config) {
        this.buildBaseInfo(config);
        this.buildAnimeLayer(this.layer);
        this.buildMaskLayer(this.layer, config.ctx);
        this.buildExtraAttrsByType(this.layer);
    }

    buildBaseInfo({
        layer,
        frame,
        frames,
        startFrame,
        options,
    }) {
        const { ind, refId: id, parent = 0, ip, ef: effects = {}, st, nm, op, level, ty } = layer;
        this._unionId = `layer-bm-${level}-${ind}`;
        this.parentId = `layer-bm-${level - 1}-${parent}`;
        this.type = TypeEnum[ty];
        this.name = nm;
        this.id = id || this.name;
        this.frames = frames;
        this.layer = layer;
        this.frame = frame;
        this._startFrame = startFrame;
        this._initialFramePoint = ip;
        this._finalFramePoint = op;
        this._startTime = st;
        this._options = options;
        this.index = ind;
        this.attributes = {};
        this._effects = effects;
        this.animeFrames = [];
        this.animeOptions = {};
    }

    outputJSON() {
        return {
            id: this.id,
            unionId: this._unionId,
            parentId: this.parentId,
            name: this.name,
            type: this.type,
            frame: this.frame,
            totalFrames: this.frames, 
            startFrame: this._startFrame,
            initialFramePoint: this._initialFramePoint,
            finalFramePoint: this._finalFramePoint,
            attributes: this.attributes,
            animeFrames: this.animeFrames,
            _options: this._options,
            _effects: this._effects,
            animeOptions: this.animeOptions,
            maskList: this.maskList,
        }
    }

    outputSource() {
        return this.layer;
    }

    buildAnimeLayer(layer) {
        const { ks } = layer;
        Object.keys(ks).forEach((key) => {
            const layer = ks[key];
            return this.buildMetricsAnime(key, layer);
        });
        // 关键帧过滤
        this.animeFrames = this.animeFrames.filter((frame) => frame.index === 0 || frame.index >= this.animeFrames.length - 1 || frame.isKeyFrame);
        return;
    }

    buildMaskLayer(layer, ctx) {
        if (!layer.hasMask) return;
        this.maskList = layer.masksProperties.map((mask) => {
            return new Mask({
                data: mask,
                index: ctx.maskIndex++,
            });
        })
    }

    buildMetricsAnime(type, layer) {
        switch (type) {
            case 'o':
                this.buildOpacityAnime(layer);
                break;
            case 'r':
                this.buildRotateAnime(layer);
                break;
            case 'p':
                this.buildPositionAnime(layer);
                break;
            case 'a':
                this.buildAnchorAnime(layer);
                break;
            case 's':
                this.buildScaleAnime(layer);
                break;
            case 'sk':
                this.buildSkewAnime(layer);
            default:
                break;
        }
    }

    buildOpacityAnime(layer) {
        if (isAttribute('o', layer)) {
            this.attributes['opacity'] = this.getOpacityStyle(layer.k);
            return;
        }
        const opacityFrames = buildOpacityFrames({
            layer: layer.k,
            frames: this.frames,
            startFrame: this._startFrame,
        });
        if (!this.attributes['opacity']) {
            this.attributes['opacity'] = opacityFrames[0].opacity;
        }
        this.animeOptions = {
            ...this.animeOptions,
            ...parseExpression(layer.x)
        };
        this.buildAnimeFrames(opacityFrames);
    }

    buildRotateAnime(layer) {
        if (isAttribute('r', layer)) {
            this.attributes['rotate'] = this.getRotateStyle(layer.k);
            return;
        }
        const rotateFrames = buildRotateFrames({
            layer: layer.k,
            frames: this.frames,
            startFrame: this._startFrame,
        });
        if (!this.attributes['rotate']) {
            this.attributes['rotate'] = rotateFrames[0].rotate;
        }
        this.animeOptions = {
            ...this.animeOptions,
            ...parseExpression(layer.x)
        };
        this.buildAnimeFrames(rotateFrames);
    }

    buildPositionAnime(layer) {
        if (isAttribute('p', layer)) {
            this.attributes['position'] = this.getPositionStyle(layer.k);
            return;
        }
        const positionFrames = buildPositionFrames({
            layer: layer.k,
            frames: this.frames,
            startFrame: this._startFrame,
        });
        if (!this.attributes['position']) {
            this.attributes['position'] = positionFrames[0].position;
        }
        this.animeOptions = {
            ...this.animeOptions,
            ...parseExpression(layer.x)
        };
        this.buildAnimeFrames(positionFrames);
    }
    
    buildAnchorAnime(layer) {
        if (isAttribute('a', layer)) {
            this.attributes['anchor'] = this.getAnchorStyle(layer.k);
            return;
        }
    }

    buildScaleAnime(layer) {
        if (isAttribute('s', layer)) {
            this.attributes['scale'] = this.getScaleStyle(layer.k);
            return;
        }
        const scaleFrames = buildScaleFrames({
            layer: layer.k,
            frames: this.frames,
            startFrame: this._startFrame,
        });
        if (!this.attributes['scale']) {
            this.attributes['scale'] = scaleFrames[0].scale;
        }
        this.animeOptions = {
            ...this.animeOptions,
            ...parseExpression(layer.x)
        };
        this.buildAnimeFrames(scaleFrames);
    }

    buildSkewAnime(layer) {
        if (isAttribute('sk', layer)) {
            this.attributes['scale'] = this.getSkewStyle(layer.k);
            return;
        }
        // TODO...
    }

    
    buildExtraAttrsByType = (layer) => {
        switch (layer.ty) {
            case LayerTypeEnum.solid:
                const { sw: width, sh: height, sc: backgroundColor, ...rest} = layer;
                this.attributes = {
                    ...this.attributes,
                    width,
                    height,
                    backgroundColor,
                }
                break;
            case LayerTypeEnum.precomp:
                const { w: jsonWidth, h: jsonHeight } = this._options;
                const { w: originW, h: originH, } = layer;
                const scale = {
                    x: this.fix(jsonWidth / originW),
                    y: this.fix(jsonHeight / originH),
                    z: 1
                };
                this.attributes = {
                    ...this.attributes,
                    scale,
                }
                break;
            default:
                break;
        }
    };

    getOpacityStyle(k: any): any {
        return Number(k / 100);
    }

    getRotateStyle(k: any): any {
        return Number(k); 
    }

    getPositionStyle(k: any): any {
        return [
            k[0], 
            k[1], 
            k[2],
        ];
    }

    getAnchorStyle(k: any): any {
        return [
            k[0], 
            k[1], 
            k[2],
        ];
    }

    getScaleStyle(k: any): any {
        return {
            x: Number(k[0] / 100),
            y: Number(k[1] / 100),
            z: Number(k[2] / 100),
        }
    }

    getSkewStyle(k: any): any {
        return Number(k);
    }

    getId() {
        return this.id;
    }

    getParentId() {
        return this.parentId;
    }

    getUnionId() {
        return this._unionId;
    }

    buildAnimeFrames(frames) {
        Object.keys(frames).forEach((key, index) => {
            const data = this.animeFrames[key] || {};
            this.animeFrames[key] = {
                ...data,
                ...frames[key],
                offset: Number(Number(index / this.frames).toFixed(5)),
            }
        });
    }

    fix(num, point = 2) {
        return Number(Number(num).toFixed(point))
    }
}

export default Layer;
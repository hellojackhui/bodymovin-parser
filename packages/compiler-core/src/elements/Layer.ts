import isAttribute from '../utils/isAttribute';
import {
    buildOpacityFrames,
    buildRotateFrames,
    buildScaleFrames,
    buildPositionFrames,
} from './Frames';

class Layer {

    frames: number; 
    index: any;
    id: any;
    _level: number;
    _startFrame: number;
    attributes: {};
    animeFrames: any[];
    parentId: string;
    _unionId: string;

    constructor({
        layer,
        frames,
        startFrame,
    }) {
        this.frames = frames;
        this._startFrame = startFrame;
        this.buildBaseInfo(layer);
        this.buildAnimeLayer(layer);
    }

    buildBaseInfo(layer) {
        const { ind, refId: id, parent = 0 } = layer;
        this.index = ind;
        this._unionId = `layer-bm-${ind}`;
        this.id = id;
        this.parentId = `layer-bm-${parent}`;
        this.attributes = {};
        this.animeFrames = [];
    }

    buildAnimeLayer(layer) {
        const { ks } = layer;
        Object.keys(ks).forEach((key) => {
            const layer = ks[key];
            this.buildMetricAnime(key, layer);
        });
    }

    buildMetricAnime(type, layer) {
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
        this.buildAnimeFrames(scaleFrames);
    }

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
        })
    }
}

export default Layer;
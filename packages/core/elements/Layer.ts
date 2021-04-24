import isAttribute from '../utils/isAttribute';
import {
    buildOpacityFrames,
    buildRotateFrames,
    buildScaleFrames,
} from './Frames';

class Layer {

    frames: number; 
    index: any;
    id: any;
    attributes: {};
    animeFrames: any[];

    constructor({
        layer,
        frames,
    }) {
        this.frames = frames;
        this.buildBaseInfo(layer);
        this.buildAnimeLayer(layer);
    }

    buildBaseInfo(layer) {
        const { ind, refId: id } = layer;
        this.index = ind;
        this.id = id;
        this.attributes = {};
        this.animeFrames = [];
    }

    buildAnimeLayer(layer) {
        const { ks } = layer;
        Object.keys(ks).forEach((key) => {
            const layer = ks[key];
            this.buildMetricAnime(key, layer);
        })
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
        });
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
        });
        this.buildAnimeFrames(rotateFrames);
    }

    buildPositionAnime(layer) {
        if (isAttribute('p', layer)) {
            this.attributes['position'] = this.getPositionStyle(layer.k);
        }
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
        });
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

    buildAnimeFrames(frames) {
        Object.keys(frames).forEach((key) => {
            const data = this.animeFrames[key] || {};
            this.animeFrames[key] = {
                ...data,
                ...frames[key],
            }
        })
    }
}

export default Layer;
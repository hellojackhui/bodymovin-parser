import { BlendModeEnum } from './enum';

class Fill {

    type: string;
    _json: JSON;
    name: any;
    hide: any;
    blendMode: BlendModeEnum;
    color: string;
    opacity: number;

    constructor(source) {
        this.buildFillModal(source);
    }

    buildFillModal(source) {
        const {bm, nm, hd = false, c, o} = source;

        this._json = source;
        this.type = 'fill';
        this.name = nm;
        this.hide = hd;
        this.blendMode = this.getBlendMode(bm);
        this.color = this.getFillColor(c.k);
        this.opacity = this.getOpacity(o.k);
    }

    getFillColor(c) {
        let color = c;
        if (c.length === 3) {
            color = [c[0], c[1], c[2], 1];
        }
        const data = [
            Number(color[0] * 255),
            Number(color[1] * 255),
            Number(color[2] * 255),
            Number(color[3])
        ]
        return `rgb(${data.join(',')})`
    }

    getOpacity(o) {
        return Number(o / 100);
    }

    getBlendMode(bm) {
        return BlendModeEnum[bm] as any;
    }

    output() {
        return {
            type: this.type,
            name: this.name,
            hide: this.hide,
            blendMode: this.blendMode,
            color: this.color,
            opacity: this.opacity,
        }
    }

}

export default Fill;
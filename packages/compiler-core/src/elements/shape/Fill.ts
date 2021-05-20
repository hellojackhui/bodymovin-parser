enum BlendModeEnum {
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'colorDodge',
    'colorBurn',
    'hardLight',
    'softLight',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
}

class Fill {

    type: string;
    name: any;
    hide: any;
    blendMode: BlendModeEnum;
    color: string;
    opacity: number;

    constructor(source) {
        this.buildFill(source);
    }

    buildFill(source) {
        const {bm, nm, hd, ty, c, o} = source;
        this.type = 'fill';
        this.name = nm;
        this.hide = hd;
        this.blendMode = this.getBlendMode(bm);
        this.color = this.getFillColor(source.c);
        this.opacity = this.getOpacity(source.o);
    }

    getFillColor(c) {
        const data = [
            Number(c[0] * 255),
            Number(c[1] * 255),
            Number(c[2] * 255),
        ]
        return `rgb(${data.join(',')})`
    }

    getOpacity(o) {
        return Number(o.k / 100);
    }

    getBlendMode(bm) {
        return BlendModeEnum[bm] as any;
    }

}

export default Fill;
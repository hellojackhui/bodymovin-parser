class Transform {
    type: string;
    _json: JSON;
    name: string;
    position: any[];
    opacity: number;
    anchor: any[];
    rotate: number;
    scale: number[];
    skew: number;
    skewAxis: number;

    constructor(source) {
        this.buildTransformModal(source);
    }
    buildTransformModal(source) {
        const { nm, p, a, s, r, o, sk, sa, } = source;
        this._json = source;
        this.type = "transform";
        this.name = nm;
        this.position = this.getPosition(p);
        this.opacity = this.getOpacity(o);
        this.anchor = this.getAnchor(a);
        this.rotate = this.getRotate(r);
        this.scale = this.getScale(s);
        this.skew = this.getSkew(sk);
        this.skewAxis = this.getSkewAxis(sa);
    }
    getPosition(data) {
        return [data.k[0], data.k[1]];
    }
    getOpacity(data) {
        return Number(data.k / 100);
    }
    getAnchor(data) {
        return [data.k[0], data.k[1]];
    }
    getRotate(data) {
        return Number(data.k);
    }
    getScale(data) {
        return [Number(data.k[0] / 100), Number(data.k[1] / 100)];
    }
    getSkew(data) {
        return Number(data.k);
    }
    getSkewAxis(data) {
        return Number(data.k);
    }
    output() {
        return {
            name: this.name,
            type: this.type,
            position: this.position,
            opacity: this.opacity,
            anchor: this.anchor,
            rotate: this.rotate,
            scale: this.scale, 
            skew: this.skew,
            skewAxis: this.skewAxis,
        };
    }
}

export default Transform;

class Transform {

    type: string;
    name: any;
    position: any[];
    opacity: number;
    anchor: any[];
    rotate: number;
    scale: number[];
    skew: number;
    skewAxis: number;
    
    constructor(source) {
        this.buildTransform(source);
    }
    buildTransform(source) {
        const {nm, ty, p, a, s, r, o, sk, sa} = source;
        this.type = 'transform';
        this.name = nm;
        this.position = this.getPosition(p);
        this.opacity = this.getOpacity(o);
        this.anchor = this.getAnchor(a);
        this.rotate = this.getRotate(r);
        this.scale = this.getScale(s);
        this.skew = this.getSkew(sk);
        this.skewAxis = this.getSkewAxis(sk);
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
}

export default Transform;
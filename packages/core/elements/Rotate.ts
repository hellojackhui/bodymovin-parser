import {
    createBezier,
    createBezierStr,
} from '../utils/bezier';

class Rotate { 

    ksSource: any;
    nextKsSource: any;
    i: any;
    o: any;
    startTime: number;
    endTime: number;
    duration: number;
    startVal: number;
    endVal: number;
    bezierFn: any;
    bezierStr: string;

    constructor({
        layer,
        nextlayer,
    }) {
        this.buildRotate({
            layer,
            nextlayer
        });
    }
    buildRotate({
        layer,
        nextlayer
    }) {
        const {t, s} = layer;
        const next = nextlayer ? nextlayer : layer;
        const {t: nt, s: ns} = next;
        this.startTime = t;
        this.endTime = nt;
        this.duration = nt - t;
        this.startVal = this.getRotate(s);
        this.endVal = this.getRotate(ns);
        this.bezierFn = createBezier('r', layer);
        this.bezierStr = createBezierStr(layer);
    }

    getRotate(s) {
        if (Array.isArray(s)) {
            return Number(s[0]);
        } else {
            return Number(s);
        }
    }

}

export default Rotate;
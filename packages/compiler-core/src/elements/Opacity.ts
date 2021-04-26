import {
    createBezier,
    createBezierStr,
} from '../utils/bezier';

class Opacity { 

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
        this.buildOpacity({
            layer,
            nextlayer
        });
    }
    buildOpacity({
        layer,
        nextlayer
    }) {
        const {t, s} = layer;
        const next = nextlayer ? nextlayer : layer;
        const {t: nt, s: ns} = next;
        this.startTime = t;
        this.endTime = nt;
        this.duration = Math.abs(nt - t);
        this.startVal = this.getOpacity(s);
        this.endVal = this.getOpacity(ns);
        this.bezierFn = createBezier('o', layer);
        this.bezierStr = createBezierStr(layer);
    }

    getOpacity(s) {
        if (Array.isArray(s)) {
            return Number(s[0] / 100);
        } else {
            return Number(s / 100);
        }
    }

}

export default Opacity;
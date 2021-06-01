import { IOpacity } from '../../index.d';
import {
    createBezier,
    createBezierStr,
    expression,
} from '../../utils/bezier';

class Opacity implements IOpacity { 

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
    expression?: any;

    constructor({
        layer,
        nextLayer,
    }) {
        this.buildOpacity({
            layer,
            nextLayer
        });
    }
    buildOpacity({
        layer,
        nextLayer
    }) {
        const {t, s, x = ''} = layer;
        const next = nextLayer ? nextLayer : layer;
        const {t: nt, s: ns} = next;
        this.startTime = t;
        this.endTime = nt;
        this.duration = Math.abs(nt - t);
        this.startVal = this.getOpacity(s);
        this.endVal = this.getOpacity(ns);
        this.bezierFn = createBezier('o', layer);
        this.bezierStr = createBezierStr(layer);
        this.expression = x ? expression(x) : null;
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
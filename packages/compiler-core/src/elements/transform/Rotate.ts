import { IRotate } from '../../index.d';
import {
    createBezier,
    createBezierStr,
} from '../../utils/bezier';

class Rotate implements IRotate { 

    ksSource: any;
    nextKsSource: any;
    startTime: number;
    endTime: number;
    duration: number;
    startVal: number;
    endVal: number;
    bezierFn: any;
    bezierStr: string;

    constructor({
        layer,
        nextLayer,
    }) {
        this.buildRotate({
            layer,
            nextLayer
        });
    }
    buildRotate({
        layer,
        nextLayer
    }) {
        const {t, s} = layer;
        const next = nextLayer ? nextLayer : layer;
        const {t: nt, s: ns} = next;
        this.startTime = t;
        this.endTime = nt;
        this.duration = Math.abs(nt - t);
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
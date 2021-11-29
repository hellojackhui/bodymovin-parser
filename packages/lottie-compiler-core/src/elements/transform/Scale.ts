import { IScale } from '../../index.d';
import {
    createBezier,
    createBezierStr,
} from '../../utils/bezier';

class Scale implements IScale{ 

    ksSource: any;
    nextKsSource: any;
    i: any;
    o: any;
    startTime: number;
    endTime: number;
    duration: number;
    startVal: number[];
    endVal: number[];
    bezierFn: any;
    bezierStr: string;

    constructor({
        layer,
        nextLayer,
    }) {
        this.buildScale({
            layer,
            nextLayer
        });
    }
    buildScale({
        layer,
        nextLayer
    }) {
        const {t, s} = layer;
        const next = nextLayer ? nextLayer : {
            t: 99999,
            s: layer.s,
        };
        const {t: nt, s: ns} = next;
        this.startTime = t;
        this.endTime = nt;
        this.duration = Math.abs(nt - t);
        this.startVal = this.getScale(s);
        this.endVal = this.getScale(ns);
        this.bezierFn = createBezier('s', layer);
        this.bezierStr = createBezierStr(layer);
    }

    getScale(s) {
        if (Array.isArray(s)) {
            return [
                Number(s[0] / 100),
                Number(s[1] / 100),
                Number(s[2] / 100),
            ];
        }
    }

}

export default Scale;
import { IPosition } from "../../index.d";
import { createBezier, createBezierStr, createParabolaList } from "../../utils/bezier";

class Position implements IPosition {

    public startTime: number;
    public endTime: number;
    public duration: number;
    public startVal: number[];
    public endVal: number[];
    public bezierFn: any;
    public bezierStr: string;
    public parabolaPointList: any;

    constructor({
        layer,
        nextLayer,
    }) {
        this.buildPosition({
            layer,
            nextLayer,
        })
    }

    buildPosition({
        layer,
        nextLayer,
    }) {
        const {t, s} = layer;
        const next = nextLayer ? nextLayer : layer;
        const {t: nt, s: ns} = next;
        this.startTime = nt < t ? nt : t;
        this.endTime = nt < t ? t : nt;
        this.duration = Math.abs(nt - t);
        this.startVal = this.getPosition(s);
        this.endVal = this.getPosition(ns);
        this.bezierFn = createBezier('p', layer);
        this.bezierStr = createBezierStr(layer);
        this.parabolaPointList = createParabolaList(layer, nextLayer);
    }

    getPosition(s) {
        if (Array.isArray(s)) {
            return [s[0], s[1], s[2]];
        } else {
            return s;
        }
    }
}

export default Position;
import Path from "./Path";

interface IRect {
    _data: JSON;
    type: string;
    direction: number;
    size: number[];
    borderRadius: number;
    name: string;
    matchName: string;
    isHidden: boolean;
    keyFrames: any;
}

class Rect implements IRect {

    _data: JSON;
    type: string;
    direction: number;
    size: number[];
    borderRadius: number;
    name: string;
    matchName: string;
    isHidden: boolean;
    keyFrames: any;

    constructor(source) {
        this._data = source;
        this.type = 'rect';
        this.direction = source.d;
        this.size = source.s.k;
        this.borderRadius = this.getBorderRadius(source.r);
        this.name = source.nm;
        this.matchName = source.mn;
        this.isHidden = source.hd || false;
        this.keyFrames = this.getKeyFrames(source.s.k);
    }

    output() {
        return {
            type: this.type,
            direction: this.direction,
            size: this.size,
            keyFrames: this.keyFrames,
            name: this.name,
            matchName: this.matchName,
            hide: this.isHidden,
        }
    }

    getBorderRadius(data) {
        return Number(data.k);
    }

    getKeyFrames(data) {
        const num1 = Math.floor(data[0] / 2);
        const num2 = Math.floor(data[1] / 2);
        const source = {
            a: false,
            c: true,
            k: {
                i: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                ],
                o: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                ],
                v: [
                    [num1, -num2],
                    [num1, num2],
                    [-num1, num2],
                    [-num1, -num2],
                ],
            }
        }
        return new Path(source).output();
    }
}

export default Rect;
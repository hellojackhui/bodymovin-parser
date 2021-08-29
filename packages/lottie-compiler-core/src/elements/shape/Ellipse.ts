import Path from "./Path";

const cPoint = 0.5519;

interface IEllipse {
    _data: JSON;
    type: string;
    position: Object;
    size: Object;
    name: string;
    matchName: string;
    isHidden: boolean;
    direction: number;
    keyFrames: any;
    _vector: any;
    getKeyFrames: (data: any) => any;
}

class Ellipse implements IEllipse {

    _data: any;
    type: string;
    keyFrames: any;
    position: {[x: string]: any};
    size: {[x: string]: any};
    name: string;
    matchName: string;
    direction: number;
    _vector: any;
    isHidden: boolean;

    constructor(data) {
        this._data = data;
        this.direction = data.d;
        this.type = 'ellipse';
        this.position = data.p;
        this.size = data.s;
        this.name = data.nm;
        this.matchName = data.mn;
        this.isHidden = data.hd;
        this._vector = this.buildSizedArray(4);
        this.keyFrames = this.getKeyFrames();
    }

    getKeyFrames() {
        const data = this.convertToPath();
        return new Path(data).output();
    }

    convertToPath() {
      var p0 = this.position.k[0];
      var p1 = this.position.k[1];
      var s0 = this.size.k[0] / 2;
      var s1 = this.size.k[1] / 2;
      var _cw = this.direction !== 3;
      var _v = this._vector;
      _v.v[0][0] = p0;
      _v.v[0][1] = p1 - s1;
      _v.v[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.v[1][1] = p1;
      _v.v[2][0] = p0;
      _v.v[2][1] = p1 + s1;
      _v.v[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.v[3][1] = p1;
      _v.i[0][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
      _v.i[0][1] = p1 - s1;
      _v.i[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.i[1][1] = p1 - s1 * cPoint;
      _v.i[2][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
      _v.i[2][1] = p1 + s1;
      _v.i[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.i[3][1] = p1 + s1 * cPoint;
      _v.o[0][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
      _v.o[0][1] = p1 - s1;
      _v.o[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.o[1][1] = p1 + s1 * cPoint;
      _v.o[2][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
      _v.o[2][1] = p1 + s1;
      _v.o[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.o[3][1] = p1 - s1 * cPoint;
      const outputPath = {
          a: 0,
          k: _v,
      }
      return outputPath;
    }

    output() {
        return {
            type: this.type,
            name: this.name,
            matchName: this.matchName,
            hide: this.isHidden,
            keyFrames: this.keyFrames,
        }
    }

    buildSizedArray(length) {
        const arr: {[x: string] : Array<number>} = {};
        const baseArr = new Array(length).fill(0).map(() => new Array(2).fill(0));
        arr.v = this.createFloat32Array(baseArr);
        arr.o = this.createFloat32Array(baseArr);
        arr.i = this.createFloat32Array(baseArr);
        return arr;
    }

    createFloat32Array = (arr) => {
        return arr.map((item) => {
          const floatArr = new Float32Array(item.length);
          item.forEach((num, index) => {
            floatArr[index] = num;
          });
          return floatArr;
        });
    };
      
}

export default Ellipse;
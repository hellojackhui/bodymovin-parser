import Path from './Path';

class Shape {
  _data: JSON;
  index: number;
  type: string;
  eIndex: number;
  keyFrames: any;
  name: string;
  matchName: string;
  hide: boolean;

  constructor(data) {
    this.buildItemModel(data);
  }

  buildItemModel(data) {
    const {
      ind: index,
      ix: eIndex,
      ks: keyFrames,
      nm: name,
      mn: matchName,
      hd: hide = false,
    } = data;
    this._data = data;
    this.index = index;
    this.type = 'shape';
    this.eIndex = eIndex;
    this.keyFrames = new Path(keyFrames).output();
    this.name = name;
    this.matchName = matchName;
    this.hide = hide;
  }

  output() {
    return {
        index: this.index,
        type: this.type,
        eIndex: this.eIndex,
        keyFrames: this.keyFrames,
        name: this.name,
        matchName: this.matchName,
        hide: this.hide,
    }
  }
}

export default Shape;

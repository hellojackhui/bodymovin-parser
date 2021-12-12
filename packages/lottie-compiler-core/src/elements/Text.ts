
const ALIGN_OF_JUSTIFICATION = {
    0: 'left',
    1: 'right',
    2: 'center'
}

enum LayerTypeEnum {
    'precomp' = 0,
    'solid' = 1,
    'image' = 2,
    'null' = 3,
    'shape' = 4,
    'text' = 5,
}

interface IText {
    source: JSON;
    _unionId: string;
    type: string;
    modelData: ITextData;
    output: () => JSON;
}

class Text implements IText {

    source: JSON;
    _unionId: string;
    type: string;
    modelData: ITextData;

    constructor({
        asset, options
    }) {
        const { index, layerType = 5, level } = options;
        
        this.source = asset;
        this._unionId = `layer-bm-${level}-${index}`;
        this.type = this.getNodeType(layerType);
        this.modelData = new TextData(asset.d.k[0].s);
    }

    getNodeType(type) {
        switch (type) {
            case LayerTypeEnum.image:
                return 'image';
            case LayerTypeEnum.shape:
                return 'shape';
            case LayerTypeEnum.text:
                return 'text';
            default:
                return 'image';
        }
    }

    output() {
        return this.source;
    }

}

interface ITextData {
    
    font: string;
    color: number;
    justify: string;
    lineHeight: number;
    lineShift: number;
    size: number;
    text: string;
    anchorX: number;
    textOffset: number;
    track: number;
}

class TextData implements ITextData {

    
    type: string;
    font: string;
    color: number;
    justify: string;
    lineHeight: number;
    lineShift: number;
    size: number;
    text: string;
    anchorX: number;
    textOffset: number;
    track: number;

    constructor(data) {
        this.font = data.f;
        this.color = this.toFontColor(data.fc);
        this.justify = ALIGN_OF_JUSTIFICATION[data.j];
        this.lineHeight = data.lh;
        this.lineShift = data.ls;
        this.size = data.s;
        this.text = data.t;
        this.anchorX = this.getAnchor(this.justify);
        this.textOffset = this.getTextOffset();
        this.track = data.tr;
    }

    toFontColor(data) {
        if (data.length > 0) {
            return parseInt(
              `0x${this.toHex(data[0])}${this.toHex(data[1])}${this.toHex(data[2])}`,
              16,
            );
        }
        return 0xffffff;
    }

    toHex(c: number) {
      if (c <= 1) {
        c *= 255;
        c = Math.floor(c);
      }
      const hex = c.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }

    getAnchor(justify) {
        if (justify == ALIGN_OF_JUSTIFICATION[0]) {
            return 0;
        } else if (justify == ALIGN_OF_JUSTIFICATION[1]) {
            return 1;
        } else if (justify == ALIGN_OF_JUSTIFICATION[2]) {
            return 0.5;
        }
    }

    getTextOffset() {
        // this.text.y -= this.text.height - dh;
        return this.lineHeight - this.size;
    }

}

export default Text;
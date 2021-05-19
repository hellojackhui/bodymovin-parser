class Mask {

    name: string;
    _id: string;
    fill: string;
    maskType: string;
    maskRef: string;
    clipRule: string;
    fillOpacity: Number;
    pathData: Array<any>;

    constructor({
        data,
        index,
    }) {
        const { nm, mode, inv, ...rest} = data;
        this.name = nm;
        this._id = `__mask_element_${index}`;
        this.fill = mode === 's' ? '#000000' : '#ffffff';
        this.clipRule = 'nonzero';
        this.getMaskType(data);
        this.getOpacity(data.o.k);
        this.buildPathArr(rest.pt.k);
    }
    
    getMaskType(data) {
        if ((data.mode !== 'a' && data.mode !== 'n') || data.inv || data.o.k !== 100 || data.o.x) {
            this.maskType = 'mask';
            this.maskRef = 'mask';
        } else {
            this.maskType = 'clipPath';
            this.maskRef = 'clip-path';
        }
    }

    getOpacity(opacity) {
        this.fillOpacity = Number(opacity / 100);
    }

    buildPathArr(data) {
        const { i, o, v} = data;
        let len = v.length;
        for(let j = 0; j < len; j++) {
            i[j][0] += v[j][0];
            i[j][1] += v[j][1];
            o[j][0] += v[j][0];
            o[j][1] += v[j][1];
        }
        this.pathData = data;
        return;
    }

}

export default Mask;
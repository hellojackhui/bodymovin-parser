import { ShapeItemTypeEnum } from '../Shapes';
import Path from './Path';
import Fill from './Fill';
import Transform from './Transform';
import Ellipse from './Ellipse';

interface IGroupItem {
    index: number;
    type: string;
    eIndex: number;
    keyFrames: any;
    name: string;
    matchName: string;
    hd: boolean;
}

interface IGroup {
    type: string;
    items: IGroupItem[];
    name: string;
    propIndex: number;
    index: number;
    matchName: string;
    hide: boolean;
}

class Group implements IGroup {

    json: any;
    type: string;
    name: any;
    propIndex: any;
    index: any;
    matchName: any;
    hide: any;
    items: any;

    constructor(data) {
        this.json = data;
        this.type = 'group';
        this.name = data.nm;
        this.propIndex = data.np;
        this.index = data.ix;
        this.matchName = data.mn;
        this.hide = data.hd;
        this.items = this.buildGroupItem(data.it);
    }

    output() {
        return {
            type: this.type,
            name: this.name,
            propIndex: this.propIndex,
            index: this.index,
            matchName: this.matchName,
            hide: this.hide,
            items: this.items,
        }
    }
    

    buildGroupItem(items) {
        if (!items) return [];
        return items.map((item, index) => {
            switch(item.ty) {
                case ShapeItemTypeEnum.SHAPE:
                    return this.buildShapeAttrs(item);
                case ShapeItemTypeEnum.FILL:
                    return this.buildFillAttrs(item);
                case ShapeItemTypeEnum.TRANSFORM:
                    return this.buildTranformAttrs(item);
                case ShapeItemTypeEnum.ELLIPSE:
                    return this.buildEllipseAttrs(item);
            }
        })
    }

    buildFillAttrs(item) {
        return new Fill(item).output();
    }

    buildTranformAttrs(data) {
        return new Transform(data).output();
    }

    buildShapeAttrs(data) {
        return new Path(data.ks).output()
    }

    buildEllipseAttrs(data) {
        return new Ellipse(data).output()
    }

}

export default Group;
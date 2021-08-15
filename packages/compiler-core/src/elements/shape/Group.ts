import { ShapeItemTypeEnum } from '../Shapes';
import Tools from '../../utils/attrTools';
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
    type: keyof ShapeItemTypeEnum;
    items: IGroupItem[];
    name: string;
    propIndex: number;
    index: number;
    matchName: string;
    hide: boolean;
}

class Group implements IGroup {

    json: any;
    type: keyof ShapeItemTypeEnum;
    name: any;
    propIndex: any;
    index: any;
    matchName: any;
    hide: any;
    items: any;

    constructor(data) {
        this.json = data;
        this.type = ShapeItemTypeEnum.GROUP;
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
            }
        })
    }

    buildFillAttrs(item) {
        return {
            type: ShapeItemTypeEnum.FILL,
            isHidden: item.hd,
            opacity: (item.o && item.o.k !== undefined) ? this.getOpacity(item.o.k) : 1,
            color: (item.c && item.c.k !== undefined) ? this.getColor(item.c.k) : 1,
        };
    }

    buildTranformAttrs(data) {
        const transformData = {
            type: ShapeItemTypeEnum.TRANSFORM,
        };
        Object.keys(data).map((key) => {
            switch(key) {
                case 'p':
                    transformData['position'] = Tools.getPosition(data.p.k);
                    break;
                case 's':
                    transformData['scale'] = Tools.getScale(data.s.k);
                    break;
                case 'r':
                    transformData['rotation'] = Tools.getRotation(data.r.k);
                    break;
                case 'o':
                    transformData['opacity'] = Tools.getOpacity(data.r.k);
                    break;

            }
        });
        return transformData;
    }

    buildShapeAttrs(data) {
        const pathData = data.ks.k;
        return {
            type: ShapeItemTypeEnum.SHAPE,
            isHidden: data.hd,
            name: data.name,
            matchName: data.matchName,
            path: Tools.buildPathList(pathData),
        }
    }

    getOpacity(num) {
        if (typeof num === 'number') {
            return num / 100;
        }
        return 1;
    }

    getColor(data) {
        if (typeof data === 'object' && Array.isArray(data)) {
            let rgb = data.slice(0, 3);
            rgb = rgb.map((item) => Number((item * 255).toFixed(5)));
            return [...rgb, 1];
        }
        return [255, 255, 255, 1];
    }

}

export default Group;
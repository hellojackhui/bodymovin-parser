import Shape from "./shape/Shape";
import Fill from "./shape/Fill";
import Transform from "./shape/Transform";
import Group from './shape/Group';
import Rect from './shape/Rect';

export enum ShapeItemTypeEnum {
  SHAPE = "sh",
  GROUP = "gr",
  FILL = "fl",
  TRANSFORM = "tr",
  RECT = "rc",
  ELLIPSE = "el",
  STAR = "sr",
  GFILL = "gf",
  GSTROKE = "gs",
  STORKE = "stroke",
  MERGE = "mm",
  TRIM = "tm",
  ROUNDEDCORNERS = "rd",
}

class Shapes {
  public matchName: string;
  public name: string;
  public direction: string;
  public items: any;
  public type: string;
  public itemCount: number;
  public blendMode: string;
  public eIndex: number;
  public hide: boolean;

  constructor({ global, json }) {
    this.buildShapeModel(json);
  }

  buildShapeModel(json) {
    const {
      mn: matchName,
      nm: name,
      d: direction = "",
      ty: type,
      it: items,
      np: itemCount,
      bm: blendMode = "",
      ix: eIndex,
      hd: hide = false,
    } = json;
    this.matchName = matchName;
    this.name = name;
    this.direction = direction;
    this.items = this.buildItemModel(items);
    this.type = ShapeItemTypeEnum[type];
    this.itemCount = itemCount;
    this.blendMode = blendMode;
    this.eIndex = eIndex;
    this.hide = hide;
  }

  buildItemModel(data) {
    const output = data.map((item) => {
      switch (item.ty) {
        case ShapeItemTypeEnum.SHAPE:
          return new Shape(item).output();
        case ShapeItemTypeEnum.FILL:
          return new Fill(item).output();
        case ShapeItemTypeEnum.TRANSFORM:
          return new Transform(item).output();
        case ShapeItemTypeEnum.GROUP:
          return new Group(item).output();
        case ShapeItemTypeEnum.RECT:
          return new Rect(item).output();
      }
    });
    return output;
  }

  output() {
    return {
      matchName: this.matchName,
      name: this.name,
      direction: this.direction,
      items: this.items,
      type: this.type,
      itemCount: this.itemCount,
      blendMode: this.blendMode,
      eIndex: this.eIndex,
      hide: this.hide,
    };
  }
}

export default Shapes;

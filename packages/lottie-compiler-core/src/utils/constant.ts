const OLayerType = {
  PRECOMP: 0,
  SOLID: 1,
  IMAGE: 2,
  NULL: 3,
  SHAPE: 4,
  TEXT: 5,
};

const enum ELayerType {
  PRECOMP,
  SOLID,
  IMAGE,
  NULL,
  SHAPE,
  TEXT,
}

enum EBlendMode {
  NORMAL,
  MULTIPLY,
  SCREEN,
  OVERLAY,
  DARKEN,
  LIGHTEN,
  COLORDODGE,
  COLORBURN,
  HARDLIGHT,
  SOFTLIGHT,
  DIFFERENCE,
  EXCLUSION,
  HUE,
  SATURATION,
  COLOR,
  LUMINOSITY,
}

const OBlendMode = {
  NORMAL: 0,
  MULTIPLY: 1,
  SCREEN: 2,
  OVERLAY: 3,
  DARKEN: 4,
  LIGHTEN: 5,
  COLORDODGE: 6,
  COLORBURN: 7,
  HARDLIGHT: 8,
  SOFTLIGHT: 9,
  DIFFERENCE: 10,
  EXCLUSION: 11,
  HUE: 12,
  SATURATION: 13,
  COLOR: 14,
  LUMINOSITY: 15,
};

enum EIsAnimate {
    FALSE,
    TRUE,
}

const OIsAnimate = {
    FALSE: 0,
    TRUE: 1,
}

const TypeEnum = ["precomp", "solid", "image", "null", "shape", "text"];

export { 
    OLayerType, 
    ELayerType,
    TypeEnum, 
    EBlendMode,
    OBlendMode,
    EIsAnimate,
    OIsAnimate, 
};

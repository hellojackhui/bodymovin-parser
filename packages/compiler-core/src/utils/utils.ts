
type isCommonAssetsType = (obj: any) => boolean;

type isLayerAssetsType = (obj: any) => boolean;

const isCommonAssets: isCommonAssetsType = (obj) => {
    return obj.id && (typeof obj.p === 'string' || typeof obj.u === 'string');
}

const isLayerAssets: isLayerAssetsType = (obj) => {
    return obj.id && obj.layers;
}

export {
    isCommonAssets,
    isLayerAssets,
}

type isCommonAssetsType = (obj: any) => boolean;

type isLayerAssetsType = (obj: any) => boolean;

const isCommonAssets: isCommonAssetsType = (obj) => {
    return obj.id && (obj.p !== undefined || obj.u !== undefined);
}

const isLayerAssets: isLayerAssetsType = (obj) => {
    return obj.id && obj.layers;
}

export {
    isCommonAssets,
    isLayerAssets,
}
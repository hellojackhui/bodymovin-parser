
type TGetRelativeSourceData = (data: JSON, refId: string) => JSON;

const getRelativeSourceData: TGetRelativeSourceData = (data, refId) => {
    const source = JSON.parse(JSON.stringify(data));
    traverseRelativeLayerAndAssets(source, refId); 
    const res = removeUnusedContent(source);
    return res;
}

function traverseRelativeLayerAndAssets(source, refId) {
    let selectedLayer = source.layers.find((item) => item.refId = refId);
    if (!selectedLayer) return null;
    let refArr = [selectedLayer];
    while (refArr.length) {
        let refContent = refArr.shift();
        refContent.read = true;
        let selectedAssetRef = source.assets.find((item) => item.id === refContent.refId);
        if (!selectedAssetRef) return;
        if (selectedAssetRef.layers) {
            selectedAssetRef.read = true;
            refArr.push(...selectedAssetRef.layers);
        } else {
            selectedAssetRef.read = true;
        }
    }
}

function removeUnusedContent(source) {
    const res = source;
    res.assets.filter((item) => item.read);
    res.layers.filter((item) => item.read);
    return res;
}


export default getRelativeSourceData;
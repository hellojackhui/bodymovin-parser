const buildSvgPath = (data) => {
    let {i: pathData, o: pathNodes, v: viewData, c: closePath} = data;
    
    pathNodes = createFloat32Array(pathNodes);
    pathData = createFloat32Array(pathData);
    viewData = createFloat32Array(viewData);

    let pathString = ` M${viewData[0][0]},${viewData[0][1]}`;
    let i;
    let len = viewData.length;
    for (i = 1; i < len; i++) {
        pathString += `C${pathNodes[i - 1][0]},${pathNodes[i - 1][1]} ${pathData[i][0]},${pathData[i][1]} ${viewData[i][0]},${viewData[i][1]}`;
    }
    if (closePath && len > 1) {
        pathString += ` C${pathNodes[i - 1][0]},${pathNodes[i - 1][1]} ${pathData[0][0]},${pathData[0][1]} ${viewData[0][0]},${viewData[0][1]}`;
    }
    return pathString;
}

const createFloat32Array = (arr) => {
    return arr.map((item) => {
        const floatArr = new Float32Array(item.length);
        item.forEach((num, index) => {
            floatArr[index] = num;
        });
        return floatArr;
    })
}

const buildClipPathTree = (data) => {
    const clipPathInstance = {
        type: data.maskType,
        id: data._id,
        children: [],
    }
    if (data.pathData) {
        const pathInstance = {
            type: 'path',
            fill: data.fill,
            fillOpacity: data.fillOpacity,
            clipRule: data.clipRule,
            d: buildSvgPath(data.pathData),
        }
        clipPathInstance.children.push(pathInstance);
    }
    return clipPathInstance;
}

export {
    buildSvgPath,
    buildClipPathTree,
}
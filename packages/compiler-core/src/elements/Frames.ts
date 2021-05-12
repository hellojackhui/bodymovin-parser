import Opacity from './Opacity';
import Rotate from './Rotate';
import Scale from './Scale';
import Position from './Position';
function buildOpacityFrames({
    layer,
    frames,
}) {
    const layerFrameList = [];
    layer.forEach((item, index) => {
        layerFrameList.push(new Opacity({
            layer: item,
            nextlayer: index !== layer.length - 1 ? layer[index + 1] : null,
        }))
    })
    return createOpacityFrameList(frames, layerFrameList);
    
}

function buildRotateFrames({
    layer,
    frames,
}) {
    const layerFrameList = [];
    layer.forEach((item, index) => {
        layerFrameList.push(new Rotate({
            layer: item,
            nextlayer: index !== layer.length - 1 ? layer[index + 1] : null,
        }))
    })
    return createRotateFrameList(frames, layerFrameList);
}

function buildAnchorFrames(layer) {
    
}

function buildPositionFrames({
    layer,
    frames,
}) {
    const layerFrameList = [];
    layer.forEach((item, index) => {
        layerFrameList.push(new Position({
            layer: item,
            nextlayer: index !== layer.length - 1 ? layer[index + 1] : null,
        }))
    })
    return createPositionFrameList(frames, layerFrameList);
}

function buildScaleFrames({
    layer,
    frames,
}) {
    const layerFrameList = [];
    layer.forEach((item, index) => {
        layerFrameList.push(new Scale({
            layer: item,
            nextlayer: index !== layer.length - 1 ? layer[index + 1] : null,
        }))
    })
    return createScaleFrameList(frames, layerFrameList);
}

function createOpacityFrameList(frame, frameList) {
    const animeFrames = {};
    const len = frameList.length;
    for (let i = 0; i <= frame; i++) {
        const area = frameList.filter((item) => item.startTime <= i && item.endTime > i);
        if (area.length) {
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr } = area[0];
            let diff = i - startTime;
            let playRatio = Number((diff / duration).toFixed(2));
            if (bezierFn) {
                let ratio = bezierFn(playRatio);
                let curVal = fix(((endVal - startVal) * ratio) + startVal, 2);
                animeFrames[i] = {
                    index: i,
                    opacity: curVal,
                    ease: bezierStr,
                }
            } else {
                let curVal = fix(((endVal - startVal) * playRatio) + startVal, 2);
                animeFrames[i] = {
                    index: i,
                    opacity: curVal,
                }
            }
        } else {
            if (i == 0) {
                animeFrames[i] = {
                    index: i,
                    opacity: frameList[0].startVal,
                }
            } else {
                animeFrames[i] = {
                    index: i,
                    opacity: frameList[len - 1].startVal,
                }
            }
        }
    }
    return animeFrames;
}

function createRotateFrameList(frame, frameList) {
    const animeFrames = {};
    const len = frameList.length;
    for (let i = 0; i <= frame; i++) {
        const area = frameList.filter((item) => item.startTime <= i && item.endTime > i);
        if (area.length) {
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr } = area[0];
            let diff = i - startTime;
            let playRatio = Number((diff / duration).toFixed(2));
            if (bezierFn) {
                let ratio = bezierFn(playRatio);
                let curVal = fix(((endVal - startVal) * ratio) + startVal, 2);
                animeFrames[i] = {
                    index: i,
                    rotate: curVal,
                    ease: bezierStr,
                }
            } else {
                let curVal = fix(((endVal - startVal) * playRatio) + startVal, 2);
                animeFrames[i] = {
                    index: i,
                    rotate: curVal,
                }
            }
        } else {
            if (i == 0) {
                animeFrames[i] = {
                    index: i,
                    rotate: frameList[0].startVal,
                }
            } else {
                animeFrames[i] = {
                    index: i,
                    rotate: frameList[len - 1].startVal,
                }
            }
        }
    }
    return animeFrames;
}

function createScaleFrameList(frame, frameList) {
    const animeFrames = {};
    const len = frameList.length;
    for (let i = 0; i <= frame; i++) {
        const area = frameList.filter((item) => item.startTime <= i && item.endTime > i);
        if (area.length) {
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr } = area[0];
            let diff = i - startTime;
            let playRatio = Number((diff / duration).toFixed(2));
            let ratio = bezierFn(playRatio);
            let offsetx = endVal[0] - startVal[0];
            let offsety = endVal[1] - startVal[1];
            let offsetz = endVal[2] - startVal[2];
            if (bezierFn) {
                let valX = fix((offsetx * ratio) + startVal[0], 4);
                let valY = fix((offsety * ratio) + startVal[1], 4);
                let valZ = fix((offsetz * ratio) + startVal[2], 4);
                animeFrames[i] = {
                    index: i,
                    scale: [valX, valY, valZ],
                    ease: bezierStr,
                }
            } else {
                let valX = fix((offsetx * playRatio) + startVal[0], 4);
                let valY = fix((offsety * playRatio) + startVal[1], 4);
                let valZ = fix((offsetz * playRatio) + startVal[2], 4);
                animeFrames[i] = {
                    index: i,
                    scale: [valX, valY, valZ],
                }
            }
        } else {
            if (i == 0) {
                animeFrames[i] = {
                    index: i,
                    scale: frameList[0].startVal,
                }
            } else {
                animeFrames[i] = {
                    index: i,
                    scale: frameList[len - 1].startVal,
                }
            }
        }
    }
    return animeFrames;
}

function createPositionFrameList(frame, frameList) {
    const animeFrames = {};
    const len = frameList.length;
    // 处理非锚点区域位置轨迹问题
    let initTime;
    for (let i = 0; i <= frame; i++) {
        const area = frameList.filter((item) => (item.startTime <= i && item.endTime > i));
        if (area.length) {
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr, parabolaPointList } = area[0];
            if (!initTime) {
                initTime = `${area[0].startTime}`;
            }
            if (parabolaPointList) {
                let diff = i - startTime;
                let offset = Math.floor((diff / duration) * 150);
                let nextpoint = parabolaPointList.points[offset].point;
                animeFrames[i] = {
                    position: [fix(nextpoint[0], 2), fix(nextpoint[1], 2), fix(nextpoint[2], 2)],
                    ease: bezierStr,
                }
            } else {
                let diff = i - startTime;
                let playRatio = Number((diff / duration).toFixed(2));
                let offsetx = endVal[0] - startVal[0];
                let offsety = endVal[1] - startVal[1];
                let offsetz = endVal[2] - startVal[2];
                if (bezierFn) {
                    let ratio = bezierFn(playRatio);
                    let valX = fix((offsetx * ratio) + startVal[0], 2);
                    let valY = fix((offsety * ratio) + startVal[1], 2);
                    let valZ = fix((offsetz * ratio) + startVal[2], 2);
                    animeFrames[i] = {
                        position: [valX, valY, valZ],
                        ease: bezierStr,
                    }
                } else {
                    let valX = fix((offsetx * playRatio) + startVal[0], 2);
                    let valY = fix((offsety * playRatio) + startVal[1], 2);
                    let valZ = fix((offsetz * playRatio) + startVal[2], 2);
                    animeFrames[i] = {
                        position: [valX, valY, valZ],
                        ease: bezierStr,
                    }
                }
            }
        } else {
            if (i <= Number(initTime) || !initTime) {
                animeFrames[i] = {
                    position: frameList[0].startVal,
                }
            } else {
                animeFrames[i] = {
                    position: frameList[len - 1].startVal,
                }
            }
        }
    }
    return animeFrames;
}

function fix(num, point = 2) {
    return Number(Number(num).toFixed(point))
}

export {
    buildOpacityFrames,
    buildRotateFrames,
    buildAnchorFrames,
    buildPositionFrames,
    buildScaleFrames,
}
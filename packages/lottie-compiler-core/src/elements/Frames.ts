import Opacity from './transform/Opacity';
import Rotate from './transform/Rotate';
import Scale from './transform/Scale';
import Position from './transform/Position';

function buildOpacityFrames({
    layer,
    frames,
    startFrame,
}) {
    const layerFrameList = [];
    layer.forEach((item, index) => {
        layerFrameList.push(new Opacity({
            layer: item,
            nextLayer: index !== layer.length - 1 ? layer[index + 1] : null,
        }))
    })
    return createOpacityFrameList(frames, layerFrameList, startFrame);
    
}

function buildRotateFrames({
    layer,
    frames,
    startFrame,
}) {
    const layerFrameList = [];
    layer.forEach((item, index) => {
        layerFrameList.push(new Rotate({
            layer: item,
            nextLayer: index !== layer.length - 1 ? layer[index + 1] : null,
        }))
    })
    return createRotateFrameList(frames, layerFrameList, startFrame);
}

function buildAnchorFrames(layer) {
    
}

function buildPositionFrames({
    layer,
    frames,
    startFrame,
}) {
    const layerFrameList = [];
    layer.forEach((item, index) => {
        layerFrameList.push(new Position({
            layer: item,
            nextLayer: index !== layer.length - 1 ? layer[index + 1] : null,
        }))
    })
    return createPositionFrameList(frames, layerFrameList, startFrame);
}

function buildScaleFrames({
    layer,
    frames,
    startFrame,
}) {
    const layerFrameList = [];
    layer.forEach((item, index) => {
        layerFrameList.push(new Scale({
            layer: item,
            nextLayer: index !== layer.length - 1 ? layer[index + 1] : null,
        }))
    })
    return createScaleFrameList(frames, layerFrameList, startFrame);
}

function createOpacityFrameList(frame, frameList, startFrame) {
    const animeFrames = {};
    const len = frameList.length;
    let initTime;
    for (let cur = 0; cur <= frame; cur++) {
        let i = cur + startFrame;
        animeFrames[cur] = {};
        const area = frameList.filter((item) => item.startTime <= i && item.endTime > i);
        if (area.length) {
            if (!initTime) {
                initTime = `${area[0].startTime}`;
            }
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr } = area[0];
            let diff = i - startTime;
            if (diff < 1) {
                animeFrames[cur] = {
                    isKeyFrame: true,
                }
            }
            let playRatio = Number((diff / duration).toFixed(2));
            if (bezierFn) {
                let ratio = bezierFn(playRatio);
                let curVal = fix(((endVal - startVal) * ratio) + startVal, 2);
                animeFrames[cur] = {
                    ...animeFrames[cur],
                    index: cur,
                    opacity: curVal,
                    ease: bezierStr,
                }
            } else {
                let curVal = fix(((endVal - startVal) * playRatio) + startVal, 2);
                animeFrames[cur] = {
                    ...animeFrames[cur],
                    index: cur,
                    opacity: curVal,
                }
            }
        } else {
            if (i <= Number(initTime) || !initTime) {
                animeFrames[cur] = {
                    index: cur,
                    opacity: frameList[0].startVal,
                }
            } else {
                animeFrames[cur] = {
                    index: cur,
                    opacity: frameList[len - 1].startVal,
                }
            }
        }
    }
    return animeFrames;
}

function createRotateFrameList(frame, frameList, startFrame) {
    const animeFrames = {};
    const len = frameList.length;
    let initTime;
    for (let cur = 0; cur <= frame; cur++) {
        let i = cur + startFrame;
        animeFrames[cur] = {};
        const area = frameList.filter((item) => item.startTime <= i && item.endTime > i);
        if (area.length) {
            if (!initTime) {
                initTime = `${area[0].startTime}`;
            }
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr } = area[0];
            let diff = i - startTime;
            if (diff < 1) {
                animeFrames[cur] = {
                    isKeyFrame: true,
                }
            }
            let playRatio = Number((diff / duration).toFixed(2));
            if (bezierFn) {
                let ratio = bezierFn(playRatio);
                let curVal = fix(((endVal - startVal) * ratio) + startVal, 2);
                animeFrames[cur] = {
                    ...animeFrames[cur],
                    index: cur,
                    rotate: curVal,
                    ease: bezierStr,
                }
            } else {
                let curVal = fix(((endVal - startVal) * playRatio) + startVal, 2);
                animeFrames[cur] = {
                    ...animeFrames[cur],
                    index: cur,
                    rotate: curVal,
                }
            }
        } else {
            if (i <= Number(initTime) || !initTime) {
                animeFrames[cur] = {
                    index: cur,
                    rotate: frameList[0].startVal,
                }
            } else {
                animeFrames[cur] = {
                    index: cur,
                    rotate: frameList[len - 1].startVal,
                }
            }
        }
    }
    return animeFrames;
}

function createScaleFrameList(frame, frameList, startFrame) {
    const animeFrames = {};
    const len = frameList.length;
    let initTime;
    for (let cur = 0; cur <= frame; cur++) {
        let i = cur + startFrame;
        animeFrames[cur] = {};
        const area = frameList.filter((item) => item.startTime <= i && item.endTime > i);
        if (area.length) {
            if (!initTime) {
                initTime = `${area[0].startTime}`;
            }
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr } = area[0];
            let diff = i - startTime;
            if (diff < 1) {
                animeFrames[cur] = {
                    isKeyFrame: true,
                }
            }
            let playRatio = Number((diff / duration).toFixed(2));
            let ratio = bezierFn ? bezierFn(playRatio) : 1;
            let offsetX = endVal[0] - startVal[0];
            let offsetY = endVal[1] - startVal[1];
            let offsetZ = endVal[2] - startVal[2];
            if (bezierFn) {
                let valX = fix((offsetX * ratio) + startVal[0], 4);
                let valY = fix((offsetY * ratio) + startVal[1], 4);
                let valZ = fix((offsetZ * ratio) + startVal[2], 4);
                animeFrames[cur] = {
                    ...animeFrames[cur],
                    index: cur,
                    scale: [valX, valY, valZ],
                    ease: bezierStr,
                }
            } else {
                let valX = fix((offsetX * playRatio) + startVal[0], 4);
                let valY = fix((offsetY * playRatio) + startVal[1], 4);
                let valZ = fix((offsetZ * playRatio) + startVal[2], 4);
                animeFrames[cur] = {
                    ...animeFrames[cur],
                    index: cur,
                    scale: [valX, valY, valZ],
                }
            }
        } else {
            if (i <= Number(initTime) || !initTime) {
                animeFrames[cur] = {
                    index: cur,
                    scale: frameList[0].startVal,
                }
            } else {
                animeFrames[cur] = {
                    index: cur,
                    scale: frameList[len - 1].startVal,
                }
            }
        }
    }
    return animeFrames;
}

function createPositionFrameList(frame, frameList, startFrame) {
    const animeFrames = {};
    const len = frameList.length;
    // 处理非锚点区域位置轨迹问题
    let initTime;
    let isHead = true;
    let isFoot = true;
    for (let cur = 0; cur <= frame; cur++) {
        let i = cur + startFrame;
        animeFrames[cur] = {};
        const area = frameList.filter((item) => (item.startTime <= i && item.endTime > i));
        if (area.length) {
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr, parabolaPointList, isFF = false } = area[0];
            if (!initTime) {
                initTime = `${area[0].startTime}`;
            }
            let diff = i - startTime;
            if (diff < 1) {
                animeFrames[cur] = {
                    isKeyFrame: true,
                }
            }
            if (parabolaPointList) {
                let offset = Math.floor((diff / duration) * 150);
                offset = offset == 150 ? offset - 1 : offset;
                let nextPoint = parabolaPointList.points[offset].point;
                animeFrames[cur] = {
                    ...animeFrames[cur],
                    position: [fix(nextPoint[0], 5), fix(nextPoint[1], 5), fix(nextPoint[2], 5)],
                    ease: bezierStr,
                    isKeyFrame: true,
                }
            } else {
                let playRatio = Number((diff / duration).toFixed(2));
                let offsetX = endVal[0] - startVal[0];
                let offsetY = endVal[1] - startVal[1];
                let offsetZ = endVal[2] - startVal[2];
                if (bezierFn) {
                    let ratio = bezierFn(playRatio);
                    let valX = fix((offsetX * ratio) + startVal[0], 5);
                    let valY = fix((offsetY * ratio) + startVal[1], 5);
                    let valZ = fix((offsetZ * ratio) + startVal[2], 5);
                    animeFrames[cur] = {
                        ...animeFrames[cur],
                        position: [valX, valY, valZ],
                        ease: bezierStr,
                    }
                } else {
                    let valX = fix((offsetX * playRatio) + startVal[0], 5);
                    let valY = fix((offsetY * playRatio) + startVal[1], 5);
                    let valZ = fix((offsetZ * playRatio) + startVal[2], 5);
                    animeFrames[cur] = {
                        ...animeFrames[cur],
                        position: [valX, valY, valZ],
                        ease: bezierStr,
                    }
                }
            }
        } else {
            if (i <= Number(initTime) || !initTime) {
                if (isHead) {
                    animeFrames[cur]['isKeyFrame'] = true;
                    isHead = false;
                }
                animeFrames[cur] = {
                    ...animeFrames[cur],
                    position: frameList[0].startVal,
                }
            } else {
                if (isFoot) {
                    animeFrames[cur]['isKeyFrame'] = true;
                    isFoot = false;
                }
                animeFrames[cur] = {
                    ...animeFrames[cur],
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
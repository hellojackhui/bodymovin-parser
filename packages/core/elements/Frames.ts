import Opacity from './Opacity';
import Rotate from './Rotate';
import Scale from './Scale';

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

function buildPositionFrames(layer) {
    
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
    for (let i = 0; i < frame; i++) {
        const area = frameList.filter((item) => item.startTime <= i && item.endTime > i);
        if (area.length) {
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr } = area[0];
            let diff = i - startTime;
            let playRatio = Number((diff / duration).toFixed(2));
            if (bezierFn) {
                let ratio = bezierFn(playRatio);
                let curVal = ((endVal - startVal) * ratio) + startVal;
                animeFrames[i] = {
                    index: i,
                    opacity: curVal,
                    ease: bezierStr,
                }
            } else {
                let curVal = ((endVal - startVal) * playRatio) + startVal;
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
    for (let i = 0; i < frame; i++) {
        const area = frameList.filter((item) => item.startTime <= i && item.endTime > i);
        if (area.length) {
            const { startTime, duration, startVal, endVal, bezierFn, bezierStr } = area[0];
            let diff = i - startTime;
            let playRatio = Number((diff / duration).toFixed(2));
            if (bezierFn) {
                let ratio = bezierFn(playRatio);
                let curVal = ((endVal - startVal) * ratio) + startVal;
                animeFrames[i] = {
                    index: i,
                    rotate: curVal,
                    ease: bezierStr,
                }
            } else {
                let curVal = ((endVal - startVal) * playRatio) + startVal;
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
    for (let i = 0; i < frame; i++) {
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
                let valX = (offsetx * ratio) + startVal[0];
                let valY = (offsety * ratio) + startVal[1];
                let valZ = (offsetz * ratio) + startVal[2];
                animeFrames[i] = {
                    index: i,
                    scale: [valX, valY, valZ],
                    ease: bezierStr,
                }
            } else {
                let valX = (offsetx * playRatio) + startVal[0];
                let valY = (offsety * playRatio) + startVal[1];
                let valZ = (offsetz * playRatio) + startVal[2];
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

export {
    buildOpacityFrames,
    buildRotateFrames,
    buildAnchorFrames,
    buildPositionFrames,
    buildScaleFrames,
}
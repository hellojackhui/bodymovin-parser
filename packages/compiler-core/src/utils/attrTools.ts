function getPosition(data) {
    if (typeof data === 'number') {
        return [data, 0, 0];
    }
    if (Array.isArray(data)) {
        let remain = 3 - data.length;
        return [...data, ...new Array(remain).fill(0)];
    }
    return data;
}

function getAnchor(data) {
    if (typeof data === 'number') {
        return [data / 100, 0, 0];
    }
    if (Array.isArray(data)) {
        let remain = 3 - data.length;
        return [...data, ...new Array(remain).fill(0)];
    }
}

function getScale(data) {
    if (typeof data === 'number') {
        return [data / 100, 0, 0];
    }
    if (Array.isArray(data)) {
        let remain = 3 - data.length;
        return [...data.map((item) => item / 100), ...new Array(remain).fill(0)];
    }
}


function getRotation(data) {
    if (typeof data === 'number') {
        return [data, 0, 0];
    }
    if (Array.isArray(data)) {
        let remain = 3 - data.length;
        return [...data, ...new Array(remain).fill(0)];
    }
}

function getOpacity(data) {
    if (typeof data === 'number') {
        return data / 100;
    }
    return 1;
}

function buildPathList(path) {
    let i;
    let len = path.i.length;
    for (i = 0; i < len; i += 1) {
        path.i[i][0] += path.v[i][0];
        path.i[i][1] += path.v[i][1];
        path.o[i][0] += path.v[i][0];
        path.o[i][1] += path.v[i][1];
    }
    return path;
}

export default {
    getPosition,
    getAnchor,
    getScale,
    getRotation,
    getOpacity,
    buildPathList,
}
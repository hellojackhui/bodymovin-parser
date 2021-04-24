import BezierEasing from './bezier-easing';

const createBezier = (type, data) => {
    switch(type) {
        case 'o': return createOpacityEasing(data);break;
        case 'r': return createRotationEasing(data);break;
        case 'p': return createPositionBezier(data);break;
        case 's': return createScaleBezier(data);break;
    }
}

function createOpacityEasing(animedata) {
    if (animedata.i && animedata.o && typeof animedata.o.x === 'object' && typeof animedata.i.x === 'object') {
        return BezierEasing(animedata.o.x[0], animedata.o.y[0], animedata.i.x[0], animedata.i.y[0]);
    }
}

function createRotationEasing(animedata) {
    if (animedata.i && animedata.o && typeof animedata.o.x === 'object' && typeof animedata.i.x === 'object') {
        return BezierEasing(animedata.o.x[0], animedata.o.y[0], animedata.i.x[0], animedata.i.y[0]);
    }
}

function createPositionBezier(animedata) {
    if (animedata.o && animedata.i) {
        if (Array.isArray(animedata.o.x) && Array.isArray(animedata.o.y)) {
          return BezierEasing(animedata.o.x[0], animedata.o.y[0], animedata.i.x[0], animedata.i.y[0]);
        } else {
          return BezierEasing(animedata.o.x, animedata.o.y, animedata.i.x, animedata.i.y);
        }
    } else {
        return null;
    }
}

function createScaleBezier(animedata) {
    if (animedata.i && animedata.o && typeof animedata.o.x === 'object' && typeof animedata.i.x === 'object') {
        return BezierEasing(animedata.o.x[0], animedata.o.y[0], animedata.i.x[0], animedata.i.y[0]);
    }
}

function createBezierStr(layer) {
    if (layer.i && layer.o) {
        const {x: ix, y: iy} = layer.i;
        const {x: ox, y: oy} = layer.o;
        if (Array.isArray(ix)) {
            return `cube-bezier(${ix[0]}, ${ox[0]}, ${iy[0]}, ${oy[0]})`;
        } else {
            return `cube-bezier(${ix}, ${ox}, ${iy}, ${oy})`;
        }
    }
}

export {
    createBezier,
    createBezierStr,
};
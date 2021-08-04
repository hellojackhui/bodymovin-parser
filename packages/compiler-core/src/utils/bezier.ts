import BezierEasing from './bezier-easing';
import buildBezierPoints from './bezier-path';

const createBezier = (type, data) => {
    switch(type) {
        case 'o': return createOpacityEasing(data);break;
        case 'r': return createRotationEasing(data);break;
        case 'p': return createPositionBezier(data);break;
        case 's': return createScaleBezier(data);break;
    }
}

function createOpacityEasing(animeData) {
    if (animeData.i && animeData.o && typeof animeData.o.x === 'object' && typeof animeData.i.x === 'object') {
        return BezierEasing(animeData.o.x[0], animeData.o.y[0], animeData.i.x[0], animeData.i.y[0]);
    }
}

function createRotationEasing(animeData) {
    if (animeData.i && animeData.o && typeof animeData.o.x === 'object' && typeof animeData.i.x === 'object') {
        return BezierEasing(animeData.o.x[0], animeData.o.y[0], animeData.i.x[0], animeData.i.y[0]);
    }
}

function createPositionBezier(animeData) {
    if (animeData.o && animeData.i) {
        if (Array.isArray(animeData.o.x) && Array.isArray(animeData.o.y)) {
          return BezierEasing(animeData.o.x[0], animeData.o.y[0], animeData.i.x[0], animeData.i.y[0]);
        } else {
          return BezierEasing(animeData.o.x, animeData.o.y, animeData.i.x, animeData.i.y);
        }
    } else {
        return null;
    }
}

function createScaleBezier(animeData) {
    if (animeData.i && animeData.o && typeof animeData.o.x === 'object' && typeof animeData.i.x === 'object') {
        return BezierEasing(animeData.o.x[0], animeData.o.y[0], animeData.i.x[0], animeData.i.y[0]);
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
    } else {
        return 'linear';
    }
}

function pointOnLine2D(x1, y1, x2, y2, x3, y3) {
    var det1 = (x1 * y2) + (y1 * x3) + (x2 * y3) - (x3 * y2) - (y3 * x1) - (x2 * y1);
    return det1 > -0.001 && det1 < 0.001;
}

function pointOnLine3D(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    if (z1 === 0 && z2 === 0 && z3 === 0) {
      return pointOnLine2D(x1, y1, x2, y2, x3, y3);
    }
    var dist1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    var dist2 = Math.sqrt(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2));
    var dist3 = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2));
    var diffDist;
    if (dist1 > dist2) {
      if (dist1 > dist3) {
        diffDist = dist1 - dist2 - dist3;
      } else {
        diffDist = dist3 - dist2 - dist1;
      }
    } else if (dist3 > dist2) {
      diffDist = dist3 - dist2 - dist1;
    } else {
      diffDist = dist2 - dist1 - dist3;
    }
    return diffDist > -0.0001 && diffDist < 0.0001;
  }

function createParabolaList(layer, nextLayer) {
    if (!layer || !nextLayer) {
        return null;
    }
    let s = layer.s;
    let e = nextLayer.s;
    let to = layer.to;
    let ti = layer.ti;
    if (to && ti && (s.length === 2 && !(s[0] === e[0] && s[1] === e[1]) && pointOnLine2D(s[0], s[1], e[0], e[1], s[0] + to[0], s[1] + to[1]) && pointOnLine2D(s[0], s[1], e[0], e[1], e[0] + ti[0], e[1] + ti[1])) || (s.length === 3 && !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) && pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], s[0] + to[0], s[1] + to[1], s[2] + to[2]) && pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], e[0] + ti[0], e[1] + ti[1], e[2] + ti[2]))) {
        layer.to = null;
        layer.ti = null;
    }
    if (to && ti && s[0] === e[0] && s[1] === e[1] && to[0] === 0 && to[1] === 0 && ti[0] === 0 && ti[1] === 0) {
        if (to && ti && s.length === 2 || (s[2] === e[2] && to[2] === 0 && ti[2] === 0)) {
            layer.to = null;
            layer.ti = null;
        }
    }
    if (!layer.to || !layer.ti) {
        return null;
    }
    const points = buildBezierPoints(s, e, to, ti);
    return points;
}

export {
    createBezier,
    createBezierStr,
    createParabolaList,
};
(function () {
    'use strict';

    var Asset = /** @class */ (function () {
        function Asset(assets) {
            this.assetsSource = assets;
            this.buildAssets();
        }
        Asset.prototype.buildAssets = function () {
            var _a = this.assetsSource, id = _a.id, w = _a.w, h = _a.h, u = _a.u, p = _a.p;
            this.type = 'node';
            this.id = id;
            this.width = w;
            this.height = h;
            this.path = this.buildUrlPath(u, p);
        };
        Asset.prototype.buildUrlPath = function (url, path) {
            if (/base64/.test(path)) {
                return path;
            }
            else if (url) {
                return "" + url + path;
            }
        };
        return Asset;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function isAttribute(type, data) {
        switch (type) {
            case 'o':
                return isOpacityAttribute(data);
            case 'r':
                return isRotateAttribute(data);
            case 'p':
                return isPositionAttribute(data);
            case 'a':
                return isAnchorAttribute(data);
            case 's':
                return isScaleAttribute(data);
        }
    }
    function isOpacityAttribute(data) {
        var animate = data.a, keyframes = data.k;
        return !animate && typeof keyframes === 'number';
    }
    function isRotateAttribute(data) {
        var animate = data.a, keyframes = data.k;
        return !animate && typeof keyframes === 'number';
    }
    function isPositionAttribute(data) {
        var animate = data.a, keyframes = data.k;
        return !animate && Array.isArray(keyframes);
    }
    function isAnchorAttribute(data) {
        var animate = data.a, keyframes = data.k;
        return !animate && Array.isArray(keyframes);
    }
    function isScaleAttribute(data) {
        var animate = data.a, keyframes = data.k;
        return !animate && Array.isArray(keyframes);
    }

    /**
     * https://github.com/gre/bezier-easing
     * BezierEasing - use bezier curve for transition easing function
     * by Gaëtan Renaudeau 2014 - 2015 – MIT License
     */
    // These values are established by empiricism with tests (tradeoff: performance VS precision)
    var NEWTON_ITERATIONS = 4;
    var NEWTON_MIN_SLOPE = 0.001;
    var SUBDIVISION_PRECISION = 0.0000001;
    var SUBDIVISION_MAX_ITERATIONS = 10;
    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
    var float32ArraySupported = typeof Float32Array === 'function';
    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1) { return 3.0 * aA1; }
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }
    function binarySubdivide(aX, aA, aB, mX1, mX2) {
        var currentX, currentT, i = 0;
        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            }
            else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
        return currentT;
    }
    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
            var currentSlope = getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) {
                return aGuessT;
            }
            var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
    function LinearEasing(x) {
        return x;
    }
    function bezier(mX1, mY1, mX2, mY2) {
        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }
        if (mX1 === mY1 && mX2 === mY2) {
            return LinearEasing;
        }
        // Precompute samples table
        var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        for (var i = 0; i < kSplineTableSize; ++i) {
            sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
        function getTForX(aX) {
            var intervalStart = 0.0;
            var currentSample = 1;
            var lastSample = kSplineTableSize - 1;
            for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }
            --currentSample;
            // Interpolate to provide an initial guess for t
            var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
            var guessForT = intervalStart + dist * kSampleStepSize;
            var initialSlope = getSlope(guessForT, mX1, mX2);
            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
            }
            else if (initialSlope === 0.0) {
                return guessForT;
            }
            else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
            }
        }
        return function BezierEasing(x) {
            // Because JavaScript number are imprecise, we should guarantee the extremes are right.
            if (x === 0) {
                return 0;
            }
            if (x === 1) {
                return 1;
            }
            return calcBezier(getTForX(x), mY1, mY2);
        };
    }

    var storedData = {};
    var defaultCurveSegments = 150;
    var bmPow = Math.pow;
    var bmSqrt = Math.sqrt;
    function pointOnLine2D(x1, y1, x2, y2, x3, y3) {
        var det1 = x1 * y2 + y1 * x3 + x2 * y3 - x3 * y2 - y3 * x1 - x2 * y1;
        return det1 > -0.001 && det1 < 0.001;
    }
    var BezierData = /** @class */ (function () {
        function BezierData(length) {
            this.segmentLength = 0;
            this.points = new Array(length);
        }
        return BezierData;
    }());
    function createSizedArray(len) {
        return Array.apply(null, { length: len });
    }
    var PointData = /** @class */ (function () {
        function PointData(_a) {
            var partial = _a.partial, point = _a.point;
            this.partial = partial;
            this.point = point;
        }
        return PointData;
    }());
    function bezierdata(pt1, pt2, pt3, pt4) {
        var bezierName = (pt1[0] +
            "_" +
            pt1[1] +
            "_" +
            pt2[0] +
            "_" +
            pt2[1] +
            "_" +
            pt3[0] +
            "_" +
            pt3[1] +
            "_" +
            pt4[0] +
            "_" +
            pt4[1]).replace(/\./g, "p");
        if (!storedData[bezierName]) {
            var curveSegments = defaultCurveSegments;
            var k;
            var i;
            var len;
            var ptCoord;
            var perc;
            var addedLength = 0;
            var ptDistance;
            var point;
            var lastPoint = null;
            if (pt1.length === 2 &&
                (pt1[0] !== pt2[0] || pt1[1] !== pt2[1]) &&
                pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt1[0] + pt3[0], pt1[1] + pt3[1]) &&
                pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt2[0] + pt4[0], pt2[1] + pt4[1])) {
                curveSegments = 2;
            }
            var bezierData = new BezierData(curveSegments);
            len = pt3.length;
            for (k = 0; k < curveSegments; k += 1) {
                point = createSizedArray(len);
                perc = k / (curveSegments - 1);
                ptDistance = 0;
                for (i = 0; i < len; i += 1) {
                    ptCoord =
                        bmPow(1 - perc, 3) * pt1[i] +
                            3 * bmPow(1 - perc, 2) * perc * (pt1[i] + pt3[i]) +
                            3 * (1 - perc) * bmPow(perc, 2) * (pt2[i] + pt4[i]) +
                            bmPow(perc, 3) * pt2[i];
                    point[i] = ptCoord;
                    if (lastPoint !== null) {
                        ptDistance += bmPow(point[i] - lastPoint[i], 2);
                    }
                }
                ptDistance = bmSqrt(ptDistance);
                addedLength += ptDistance;
                bezierData.points[k] = new PointData({
                    partial: ptDistance,
                    point: point,
                });
                lastPoint = point;
            }
            bezierData.segmentLength = addedLength;
            storedData[bezierName] = bezierData;
        }
        return storedData[bezierName];
    }

    var createBezier = function (type, data) {
        switch (type) {
            case 'o':
                return createOpacityEasing(data);
            case 'r':
                return createRotationEasing(data);
            case 'p':
                return createPositionBezier(data);
            case 's':
                return createScaleBezier(data);
        }
    };
    function createOpacityEasing(animedata) {
        if (animedata.i && animedata.o && typeof animedata.o.x === 'object' && typeof animedata.i.x === 'object') {
            return bezier(animedata.o.x[0], animedata.o.y[0], animedata.i.x[0], animedata.i.y[0]);
        }
    }
    function createRotationEasing(animedata) {
        if (animedata.i && animedata.o && typeof animedata.o.x === 'object' && typeof animedata.i.x === 'object') {
            return bezier(animedata.o.x[0], animedata.o.y[0], animedata.i.x[0], animedata.i.y[0]);
        }
    }
    function createPositionBezier(animedata) {
        if (animedata.o && animedata.i) {
            if (Array.isArray(animedata.o.x) && Array.isArray(animedata.o.y)) {
                return bezier(animedata.o.x[0], animedata.o.y[0], animedata.i.x[0], animedata.i.y[0]);
            }
            else {
                return bezier(animedata.o.x, animedata.o.y, animedata.i.x, animedata.i.y);
            }
        }
        else {
            return null;
        }
    }
    function createScaleBezier(animedata) {
        if (animedata.i && animedata.o && typeof animedata.o.x === 'object' && typeof animedata.i.x === 'object') {
            return bezier(animedata.o.x[0], animedata.o.y[0], animedata.i.x[0], animedata.i.y[0]);
        }
    }
    function createBezierStr(layer) {
        if (layer.i && layer.o) {
            var _a = layer.i, ix = _a.x, iy = _a.y;
            var _b = layer.o, ox = _b.x, oy = _b.y;
            if (Array.isArray(ix)) {
                return "cube-bezier(" + ix[0] + ", " + ox[0] + ", " + iy[0] + ", " + oy[0] + ")";
            }
            else {
                return "cube-bezier(" + ix + ", " + ox + ", " + iy + ", " + oy + ")";
            }
        }
        else {
            return 'linear';
        }
    }
    function createParabolaList(layer, nextlayer) {
        if (!layer.to || !layer.ti) {
            return null;
        }
        var pointdata = bezierdata(layer.s, nextlayer.s, layer.to, layer.ti);
        return pointdata;
    }

    var Opacity = /** @class */ (function () {
        function Opacity(_a) {
            var layer = _a.layer, nextlayer = _a.nextlayer;
            this.buildOpacity({
                layer: layer,
                nextlayer: nextlayer
            });
        }
        Opacity.prototype.buildOpacity = function (_a) {
            var layer = _a.layer, nextlayer = _a.nextlayer;
            var t = layer.t, s = layer.s;
            var next = nextlayer ? nextlayer : layer;
            var nt = next.t, ns = next.s;
            this.startTime = t;
            this.endTime = nt;
            this.duration = Math.abs(nt - t);
            this.startVal = this.getOpacity(s);
            this.endVal = this.getOpacity(ns);
            this.bezierFn = createBezier('o', layer);
            this.bezierStr = createBezierStr(layer);
        };
        Opacity.prototype.getOpacity = function (s) {
            if (Array.isArray(s)) {
                return Number(s[0] / 100);
            }
            else {
                return Number(s / 100);
            }
        };
        return Opacity;
    }());

    var Rotate = /** @class */ (function () {
        function Rotate(_a) {
            var layer = _a.layer, nextlayer = _a.nextlayer;
            this.buildRotate({
                layer: layer,
                nextlayer: nextlayer
            });
        }
        Rotate.prototype.buildRotate = function (_a) {
            var layer = _a.layer, nextlayer = _a.nextlayer;
            var t = layer.t, s = layer.s;
            var next = nextlayer ? nextlayer : layer;
            var nt = next.t, ns = next.s;
            this.startTime = t;
            this.endTime = nt;
            this.duration = Math.abs(nt - t);
            this.startVal = this.getRotate(s);
            this.endVal = this.getRotate(ns);
            this.bezierFn = createBezier('r', layer);
            this.bezierStr = createBezierStr(layer);
        };
        Rotate.prototype.getRotate = function (s) {
            if (Array.isArray(s)) {
                return Number(s[0]);
            }
            else {
                return Number(s);
            }
        };
        return Rotate;
    }());

    var Scale = /** @class */ (function () {
        function Scale(_a) {
            var layer = _a.layer, nextlayer = _a.nextlayer;
            this.buildScale({
                layer: layer,
                nextlayer: nextlayer
            });
        }
        Scale.prototype.buildScale = function (_a) {
            var layer = _a.layer, nextlayer = _a.nextlayer;
            var t = layer.t, s = layer.s;
            var next = nextlayer ? nextlayer : layer;
            var nt = next.t, ns = next.s;
            this.startTime = t;
            this.endTime = nt;
            this.duration = Math.abs(nt - t);
            this.startVal = this.getScale(s);
            this.endVal = this.getScale(ns);
            this.bezierFn = createBezier('s', layer);
            this.bezierStr = createBezierStr(layer);
        };
        Scale.prototype.getScale = function (s) {
            if (Array.isArray(s)) {
                return [
                    Number(s[0] / 100),
                    Number(s[1] / 100),
                    Number(s[2] / 100),
                ];
            }
        };
        return Scale;
    }());

    var Position = /** @class */ (function () {
        function Position(_a) {
            var layer = _a.layer, nextlayer = _a.nextlayer;
            this.buildPosition({
                layer: layer,
                nextlayer: nextlayer,
            });
        }
        Position.prototype.buildPosition = function (_a) {
            var layer = _a.layer, nextlayer = _a.nextlayer;
            var t = layer.t, s = layer.s;
            var next = nextlayer ? nextlayer : layer;
            var nt = next.t, ns = next.s;
            this.startTime = nt < t ? nt : t;
            this.endTime = nt < t ? t : nt;
            this.duration = Math.abs(nt - t);
            this.startVal = this.getPosition(s);
            this.endVal = this.getPosition(ns);
            this.bezierFn = createBezier('p', layer);
            this.bezierStr = createBezierStr(layer);
            this.parabolaPointList = createParabolaList(layer, nextlayer);
        };
        Position.prototype.getPosition = function (s) {
            if (Array.isArray(s)) {
                return [s[0], s[1], s[2]];
            }
            else {
                return s;
            }
        };
        return Position;
    }());

    function buildOpacityFrames(_a) {
        var layer = _a.layer, frames = _a.frames;
        var layerFrameList = [];
        layer.forEach(function (item, index) {
            layerFrameList.push(new Opacity({
                layer: item,
                nextlayer: index !== layer.length - 1 ? layer[index + 1] : null,
            }));
        });
        return createOpacityFrameList(frames, layerFrameList);
    }
    function buildRotateFrames(_a) {
        var layer = _a.layer, frames = _a.frames;
        var layerFrameList = [];
        layer.forEach(function (item, index) {
            layerFrameList.push(new Rotate({
                layer: item,
                nextlayer: index !== layer.length - 1 ? layer[index + 1] : null,
            }));
        });
        return createRotateFrameList(frames, layerFrameList);
    }
    function buildPositionFrames(_a) {
        var layer = _a.layer, frames = _a.frames;
        var layerFrameList = [];
        layer.forEach(function (item, index) {
            layerFrameList.push(new Position({
                layer: item,
                nextlayer: index !== layer.length - 1 ? layer[index + 1] : null,
            }));
        });
        return createPositionFrameList(frames, layerFrameList);
    }
    function buildScaleFrames(_a) {
        var layer = _a.layer, frames = _a.frames;
        var layerFrameList = [];
        layer.forEach(function (item, index) {
            layerFrameList.push(new Scale({
                layer: item,
                nextlayer: index !== layer.length - 1 ? layer[index + 1] : null,
            }));
        });
        return createScaleFrameList(frames, layerFrameList);
    }
    function createOpacityFrameList(frame, frameList) {
        var animeFrames = {};
        var len = frameList.length;
        var _loop_1 = function (i) {
            var area = frameList.filter(function (item) { return item.startTime <= i && item.endTime > i; });
            if (area.length) {
                var _a = area[0], startTime = _a.startTime, duration = _a.duration, startVal = _a.startVal, endVal = _a.endVal, bezierFn = _a.bezierFn, bezierStr = _a.bezierStr;
                var diff = i - startTime;
                var playRatio = Number((diff / duration).toFixed(2));
                if (bezierFn) {
                    var ratio = bezierFn(playRatio);
                    var curVal = ((endVal - startVal) * ratio) + startVal;
                    animeFrames[i] = {
                        index: i,
                        opacity: curVal,
                        ease: bezierStr,
                    };
                }
                else {
                    var curVal = ((endVal - startVal) * playRatio) + startVal;
                    animeFrames[i] = {
                        index: i,
                        opacity: curVal,
                    };
                }
            }
            else {
                if (i == 0) {
                    animeFrames[i] = {
                        index: i,
                        opacity: frameList[0].startVal,
                    };
                }
                else {
                    animeFrames[i] = {
                        index: i,
                        opacity: frameList[len - 1].startVal,
                    };
                }
            }
        };
        for (var i = 0; i < frame; i++) {
            _loop_1(i);
        }
        return animeFrames;
    }
    function createRotateFrameList(frame, frameList) {
        var animeFrames = {};
        var len = frameList.length;
        var _loop_2 = function (i) {
            var area = frameList.filter(function (item) { return item.startTime <= i && item.endTime > i; });
            if (area.length) {
                var _a = area[0], startTime = _a.startTime, duration = _a.duration, startVal = _a.startVal, endVal = _a.endVal, bezierFn = _a.bezierFn, bezierStr = _a.bezierStr;
                var diff = i - startTime;
                var playRatio = Number((diff / duration).toFixed(2));
                if (bezierFn) {
                    var ratio = bezierFn(playRatio);
                    var curVal = ((endVal - startVal) * ratio) + startVal;
                    animeFrames[i] = {
                        index: i,
                        rotate: curVal,
                        ease: bezierStr,
                    };
                }
                else {
                    var curVal = ((endVal - startVal) * playRatio) + startVal;
                    animeFrames[i] = {
                        index: i,
                        rotate: curVal,
                    };
                }
            }
            else {
                if (i == 0) {
                    animeFrames[i] = {
                        index: i,
                        rotate: frameList[0].startVal,
                    };
                }
                else {
                    animeFrames[i] = {
                        index: i,
                        rotate: frameList[len - 1].startVal,
                    };
                }
            }
        };
        for (var i = 0; i < frame; i++) {
            _loop_2(i);
        }
        return animeFrames;
    }
    function createScaleFrameList(frame, frameList) {
        var animeFrames = {};
        var len = frameList.length;
        var _loop_3 = function (i) {
            var area = frameList.filter(function (item) { return item.startTime <= i && item.endTime > i; });
            if (area.length) {
                var _a = area[0], startTime = _a.startTime, duration = _a.duration, startVal = _a.startVal, endVal = _a.endVal, bezierFn = _a.bezierFn, bezierStr = _a.bezierStr;
                var diff = i - startTime;
                var playRatio = Number((diff / duration).toFixed(2));
                var ratio = bezierFn(playRatio);
                var offsetx = endVal[0] - startVal[0];
                var offsety = endVal[1] - startVal[1];
                var offsetz = endVal[2] - startVal[2];
                if (bezierFn) {
                    var valX = (offsetx * ratio) + startVal[0];
                    var valY = (offsety * ratio) + startVal[1];
                    var valZ = (offsetz * ratio) + startVal[2];
                    animeFrames[i] = {
                        index: i,
                        scale: [valX, valY, valZ],
                        ease: bezierStr,
                    };
                }
                else {
                    var valX = (offsetx * playRatio) + startVal[0];
                    var valY = (offsety * playRatio) + startVal[1];
                    var valZ = (offsetz * playRatio) + startVal[2];
                    animeFrames[i] = {
                        index: i,
                        scale: [valX, valY, valZ],
                    };
                }
            }
            else {
                if (i == 0) {
                    animeFrames[i] = {
                        index: i,
                        scale: frameList[0].startVal,
                    };
                }
                else {
                    animeFrames[i] = {
                        index: i,
                        scale: frameList[len - 1].startVal,
                    };
                }
            }
        };
        for (var i = 0; i < frame; i++) {
            _loop_3(i);
        }
        return animeFrames;
    }
    function createPositionFrameList(frame, frameList) {
        var animeFrames = {};
        var len = frameList.length;
        var _loop_4 = function (i) {
            var area = frameList.filter(function (item) { return item.startTime <= i && item.endTime > i; });
            if (area.length) {
                var _a = area[0], startTime = _a.startTime, duration = _a.duration, startVal = _a.startVal, endVal = _a.endVal, bezierFn = _a.bezierFn, bezierStr = _a.bezierStr, parabolaPointList = _a.parabolaPointList;
                if (parabolaPointList) {
                    var diff = i - startTime;
                    var offset = Math.ceil((diff / duration) * 150);
                    var nextpoint = parabolaPointList.points[offset].point;
                    animeFrames[i] = {
                        position: [nextpoint[0], nextpoint[1], nextpoint[2]],
                        ease: bezierStr,
                    };
                }
                else {
                    var diff = i - startTime;
                    var playRatio = Number((diff / duration).toFixed(2));
                    var offsetx = endVal[0] - startVal[0];
                    var offsety = endVal[1] - startVal[1];
                    var offsetz = endVal[2] - startVal[2];
                    if (bezierFn) {
                        var ratio = bezierFn(playRatio);
                        var valX = (offsetx * ratio) + startVal[0];
                        var valY = (offsety * ratio) + startVal[1];
                        var valZ = (offsetz * ratio) + startVal[2];
                        animeFrames[i] = {
                            position: [valX, valY, valZ],
                            ease: bezierStr,
                        };
                    }
                    else {
                        var valX = (offsetx * playRatio) + startVal[0];
                        var valY = (offsety * playRatio) + startVal[1];
                        var valZ = (offsetz * playRatio) + startVal[2];
                        animeFrames[i] = {
                            position: [valX, valY, valZ],
                            ease: bezierStr,
                        };
                    }
                }
            }
            else {
                if (i == 0) {
                    animeFrames[i] = {
                        position: frameList[0].startVal,
                    };
                }
                else {
                    animeFrames[i] = {
                        position: frameList[len - 1].startVal,
                    };
                }
            }
        };
        for (var i = 0; i < frame; i++) {
            _loop_4(i);
        }
        return animeFrames;
    }

    var Layer = /** @class */ (function () {
        function Layer(_a) {
            var layer = _a.layer, frames = _a.frames;
            this.frames = frames;
            this.buildBaseInfo(layer);
            this.buildAnimeLayer(layer);
        }
        Layer.prototype.buildBaseInfo = function (layer) {
            var ind = layer.ind, id = layer.refId;
            this.index = ind;
            this.id = id;
            this.attributes = {};
            this.animeFrames = [];
        };
        Layer.prototype.buildAnimeLayer = function (layer) {
            var _this = this;
            var ks = layer.ks;
            Object.keys(ks).forEach(function (key) {
                var layer = ks[key];
                _this.buildMetricAnime(key, layer);
            });
        };
        Layer.prototype.buildMetricAnime = function (type, layer) {
            switch (type) {
                case 'o':
                    this.buildOpacityAnime(layer);
                    break;
                case 'r':
                    this.buildRotateAnime(layer);
                    break;
                case 'p':
                    this.buildPositionAnime(layer);
                    break;
                case 'a':
                    this.buildAnchorAnime(layer);
                    break;
                case 's':
                    this.buildScaleAnime(layer);
                    break;
            }
        };
        Layer.prototype.buildOpacityAnime = function (layer) {
            if (isAttribute('o', layer)) {
                this.attributes['opacity'] = this.getOpacityStyle(layer.k);
                return;
            }
            var opacityFrames = buildOpacityFrames({
                layer: layer.k,
                frames: this.frames,
            });
            this.buildAnimeFrames(opacityFrames);
        };
        Layer.prototype.buildRotateAnime = function (layer) {
            if (isAttribute('r', layer)) {
                this.attributes['rotate'] = this.getRotateStyle(layer.k);
                return;
            }
            var rotateFrames = buildRotateFrames({
                layer: layer.k,
                frames: this.frames,
            });
            this.buildAnimeFrames(rotateFrames);
        };
        Layer.prototype.buildPositionAnime = function (layer) {
            if (isAttribute('p', layer)) {
                this.attributes['position'] = this.getPositionStyle(layer.k);
                return;
            }
            var positionFrames = buildPositionFrames({
                layer: layer.k,
                frames: this.frames,
            });
            this.buildAnimeFrames(positionFrames);
        };
        Layer.prototype.buildAnchorAnime = function (layer) {
            if (isAttribute('a', layer)) {
                this.attributes['anchor'] = this.getAnchorStyle(layer.k);
                return;
            }
        };
        Layer.prototype.buildScaleAnime = function (layer) {
            if (isAttribute('s', layer)) {
                this.attributes['scale'] = this.getScaleStyle(layer.k);
                return;
            }
            var scaleFrames = buildScaleFrames({
                layer: layer.k,
                frames: this.frames,
            });
            this.buildAnimeFrames(scaleFrames);
        };
        Layer.prototype.getOpacityStyle = function (k) {
            return Number(k / 100);
        };
        Layer.prototype.getRotateStyle = function (k) {
            return Number(k);
        };
        Layer.prototype.getPositionStyle = function (k) {
            return [
                k[0],
                k[1],
                k[2],
            ];
        };
        Layer.prototype.getAnchorStyle = function (k) {
            return [
                k[0],
                k[1],
                k[2],
            ];
        };
        Layer.prototype.getScaleStyle = function (k) {
            return {
                x: Number(k[0] / 100),
                y: Number(k[1] / 100),
                z: Number(k[2] / 100),
            };
        };
        Layer.prototype.getId = function () {
            return this.id;
        };
        Layer.prototype.buildAnimeFrames = function (frames) {
            var _this = this;
            Object.keys(frames).forEach(function (key) {
                var data = _this.animeFrames[key] || {};
                _this.animeFrames[key] = __assign(__assign({}, data), frames[key]);
            });
        };
        return Layer;
    }());

    // 解析器核心类
    var ParserCore = /** @class */ (function () {
        function ParserCore(_a) {
            var json = _a.json;
            this.json = json;
            this.buildBaseInfo();
            this.buildWrapperInfo();
            this.buildAssets();
            this.buildLayers();
        }
        ParserCore.prototype.buildBaseInfo = function () {
            var _a = this.json, nm = _a.nm, ip = _a.ip, op = _a.op, fr = _a.fr;
            this.name = nm;
            this.startframe = ip;
            this.endframe = op;
            this.frame = fr;
            this.layer = {};
            this.assetsObj = {};
        };
        ParserCore.prototype.buildWrapperInfo = function () {
            var _a = this.json, w = _a.w, h = _a.h;
            var node = {
                type: 'node',
                width: w,
                height: h,
                children: [],
                layer: {},
            };
            this.layer = node;
            return;
        };
        ParserCore.prototype.buildAssets = function () {
            var _this = this;
            var assets = this.json.assets;
            var source = [];
            assets.forEach(function (asset) {
                var assetInstance = new Asset(asset);
                source.push(assetInstance);
                _this.assetsObj[asset.id] = assetInstance;
            });
            this.layer['children'] = source;
            return;
        };
        ParserCore.prototype.outputJson = function () {
            return {
                name: this.name,
                startframe: this.startframe,
                endframe: this.endframe,
                frame: this.frame,
                layer: this.layer,
            };
        };
        ParserCore.prototype.buildLayers = function () {
            var _this = this;
            var layers = this.json.layers;
            if (!layers || !layers.length)
                return;
            var frameCount = this.endframe - this.startframe + 1;
            layers.forEach(function (layer) {
                var layerInstance = new Layer({
                    layer: layer,
                    frames: frameCount < _this.frame + 1 ? _this.frame + 1 : frameCount,
                });
                var layerId = layerInstance.getId();
                _this.assetsObj[layerId].layer = layerInstance;
            });
        };
        return ParserCore;
    }());

    return ParserCore;

}());

var storedData = {};
var defaultCurveSegments = 150;
var bmPow = Math.pow;
var bmSqrt = Math.sqrt;

function pointOnLine2D(x1, y1, x2, y2, x3, y3) {
  var det1 = x1 * y2 + y1 * x3 + x2 * y3 - x3 * y2 - y3 * x1 - x2 * y1;
  return det1 > -0.001 && det1 < 0.001;
}

class BezierData {
  public segmentLength: number;
  public points: any[];

  constructor(length) {
    this.segmentLength = 0;
    this.points = new Array(length);
  }
}

function createSizedArray(len) {
  return Array.apply(null, { length: len });
}

class PointData {
  private partial: number;
  public point: any;

  constructor({ partial, point }) {
    this.partial = partial;
    this.point = point;
  }
}

function bezierdata(pt1, pt2, pt3, pt4) {
  var bezierName = (
    pt1[0] +
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
    pt4[1]
  ).replace(/\./g, "p");
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
    if (
      pt1.length === 2 &&
      (pt1[0] !== pt2[0] || pt1[1] !== pt2[1]) &&
      pointOnLine2D(
        pt1[0],
        pt1[1],
        pt2[0],
        pt2[1],
        pt1[0] + pt3[0],
        pt1[1] + pt3[1]
      ) &&
      pointOnLine2D(
        pt1[0],
        pt1[1],
        pt2[0],
        pt2[1],
        pt2[0] + pt4[0],
        pt2[1] + pt4[1]
      )
    ) {
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
        point,
      });
      lastPoint = point;
    }
    bezierData.segmentLength = addedLength;
    storedData[bezierName] = bezierData;
  }
  return storedData[bezierName];
}


export default bezierdata;
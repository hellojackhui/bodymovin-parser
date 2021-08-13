let props = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
let _identityCalculated = false;
let _identity = true;
let shapeBoundingBox = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

// 构建path路径
const buildSvgPath = (data) => {
  let { i: pathData, o: pathNodes, v: viewData, c: closePath } = data;

  pathNodes = createFloat32Array(pathNodes);
  pathData = createFloat32Array(pathData);
  viewData = createFloat32Array(viewData);

  let pathString = ` M${viewData[0][0]},${viewData[0][1]}`;
  let i;
  let len = viewData.length;
  for (i = 1; i < len; i++) {
    pathString += `C${pathNodes[i - 1][0]},${pathNodes[i - 1][1]} ${
      pathData[i][0]
    },${pathData[i][1]} ${viewData[i][0]},${viewData[i][1]}`;
  }
  if (closePath && len > 1) {
    pathString += ` C${pathNodes[i - 1][0]},${pathNodes[i - 1][1]} ${
      pathData[0][0]
    },${pathData[0][1]} ${viewData[0][0]},${viewData[0][1]}`;
    pathString += 'z';
  }
  return pathString;
};

const createFloat32Array = (arr) => {
  return arr.map((item) => {
    const floatArr = new Float32Array(item.length);
    item.forEach((num, index) => {
      floatArr[index] = num;
    });
    return floatArr;
  });
};

const buildClipPathTree = (data) => {
  const clipPathInstance = {
    type: data.maskType,
    id: data._id,
    children: [],
  };
  if (data.pathData) {
    const pathInstance = {
      type: "path",
      fill: data.fill,
      fillOpacity: data.fillOpacity,
      clipRule: data.clipRule,
      d: buildSvgPath(data.pathData),
    };
    clipPathInstance.children.push(pathInstance);
  }
  return clipPathInstance;
};

// 构造shape类型svg树

const buildSvgContentTree = (shapes) => {
  return shapes.map((shape) => {
    const commonData = {};
    getShapeCommonData(commonData, shape);
    return buildSvgTree(commonData);
  })
};

const getShapeCommonData = (commonData, data) => {
  const items = data.items;
  items.map((item) => {
    if (!item) return;
    switch (item.type) {
      case "shape":
        commonData["shapeData"] = getShapeData(item);
        commonData["path"] = buildSvgPath(item.keyFrames.pathList);
        break;
      case "fill":
        commonData["fillData"] = getFillData(item);
        break;
      case "transform":
        commonData["transformData"] = getTransformData(item);
    }
  });
  return commonData;
};

const getFillData = (data) => {
    return {
        fill: data.color,
        fillOpacity: `${data.opacity}`,
        mixBlendMode: data.blendMode,
    }
};

const getTransformData = (data) => {
    return {
        translate: `(${data.position[0]}px, ${data.position[1]}px)`,
        opacity: data.opacity,
        rotate: `(${data.rotate / 360}deg)`,
        scale: `(${data.scale[0]}, ${data.scale[1]})`,
    }
}

// 计算路径数据
const getShapeData = (data) => {
  const boundingData = {
    x: 0,
    xMax: 0,
    y: 0,
    yMax: 0,
    width: 0,
    height: 0,
  };
  var max = 999999;
  boundingData.x = max;
  boundingData.xMax = -max;
  boundingData.y = max;
  boundingData.yMax = -max;
  calculateBoundingBox(data.keyFrames, boundingData);
  boundingData.width = boundingData.xMax < boundingData.x ? 0 : boundingData.xMax - boundingData.x;
  boundingData.height = boundingData.yMax < boundingData.y ? 0 : boundingData.yMax - boundingData.y;
  let shapeTransform = 'translate(' + boundingData.x + 'px,' + boundingData.y + 'px)';
  boundingData['shapeTransform'] = shapeTransform;
  return boundingData;
};

const calculateBoundingBox = (data, target) => {

  let pathList = data.pathList;
  let shape = pathList.v;
  let i;
  let len = shape.length;
  let vPoint;
  let oPoint;
  let nextIPoint;
  let nextVPoint;
  if (len <= 1) {
    return;
  }
  for (i = 0; i < len - 1; i += 1) {
    vPoint = getTransformedPoint(pathList.v[i]);
    oPoint = getTransformedPoint(pathList.o[i]);
    nextIPoint = getTransformedPoint(pathList.i[i + 1]);
    nextVPoint = getTransformedPoint(pathList.v[i + 1]);
    checkBounds(vPoint, oPoint, nextIPoint, nextVPoint, target);
  }
  if (shape.c) {
    vPoint = getTransformedPoint(shape.v[i]);
    oPoint = getTransformedPoint(shape.o[i]);
    nextIPoint = getTransformedPoint(shape.i[0]);
    nextVPoint = getTransformedPoint(shape.v[0]);
    checkBounds(vPoint, oPoint, nextIPoint, nextVPoint, target);
  }
};

const getTransformedPoint = (data) => {
  let x = data[0];
  let y = data[1];
  let z = data.length > 2 ? data[2] : 0;
  let arr;

  function isIdentity() {
    if (!_identityCalculated) {
      _identity = !(
        props[0] !== 1 ||
        props[1] !== 0 ||
        props[2] !== 0 ||
        props[3] !== 0 ||
        props[4] !== 0 ||
        props[5] !== 1 ||
        props[6] !== 0 ||
        props[7] !== 0 ||
        props[8] !== 0 ||
        props[9] !== 0 ||
        props[10] !== 1 ||
        props[11] !== 0 ||
        props[12] !== 0 ||
        props[13] !== 0 ||
        props[14] !== 0 ||
        props[15] !== 1
      );
      _identityCalculated = true;
    }
    return _identity;
  }
  if (isIdentity()) {
    arr = [x, y, z];
  } else {
    arr = [
      x * props[0] + y * props[4] + z * props[8] + props[12],
      x * props[1] + y * props[5] + z * props[9] + props[13],
      x * props[2] + y * props[6] + z * props[10] + props[14],
    ];
  }
  return arr;
};

const checkBounds = (vPoint, oPoint, nextIPoint, nextVPoint, boundingBox) => {
  getBoundsOfCurve(vPoint, oPoint, nextIPoint, nextVPoint);
  var bounds = shapeBoundingBox;
  boundingBox.x = Math.min(bounds.left, boundingBox.x);
  boundingBox.xMax = Math.max(bounds.right, boundingBox.xMax);
  boundingBox.y = Math.min(bounds.top, boundingBox.y);
  boundingBox.yMax = Math.max(bounds.bottom, boundingBox.yMax);
};

const getBoundsOfCurve = (p0, p1, p2, p3) => {
  var bounds = [
    [p0[0], p3[0]],
    [p0[1], p3[1]],
  ];

  const calculateF = (t, p0, p1, p2, p3, i) => {
    return (
      Math.pow(1 - t, 3) * p0[i] +
      3 * Math.pow(1 - t, 2) * t * p1[i] +
      3 * (1 - t) * Math.pow(t, 2) * p2[i] +
      Math.pow(t, 3) * p3[i]
    );
  };

  for (var a, b, c, t, b2ac, t1, t2, i = 0; i < 2; ++i) {
    // eslint-disable-line no-plusplus
    b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
    a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
    c = 3 * p1[i] - 3 * p0[i];

    b |= 0; // eslint-disable-line no-bitwise
    a |= 0; // eslint-disable-line no-bitwise
    c |= 0; // eslint-disable-line no-bitwise

    if (a === 0 && b === 0) {
      //
    } else if (a === 0) {
      t = -c / b;

      if (t > 0 && t < 1) {
        bounds[i].push(calculateF(t, p0, p1, p2, p3, i));
      }
    } else {
      b2ac = b * b - 4 * c * a;

      if (b2ac >= 0) {
        t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
        if (t1 > 0 && t1 < 1) bounds[i].push(calculateF(t1, p0, p1, p2, p3, i));
        t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
        if (t2 > 0 && t2 < 1) bounds[i].push(calculateF(t2, p0, p1, p2, p3, i));
      }
    }
  }

  shapeBoundingBox.left = Math.min(...bounds[0]);
  shapeBoundingBox.top = Math.min(...bounds[1]);
  shapeBoundingBox.right = Math.max(...bounds[0]);
  shapeBoundingBox.bottom = Math.max(...bounds[1]);

};


// 构建svg树
const buildSvgTree = (data) => {
  console.log('data', data);
  const target = {};
  // 设置svg属性
  target['type'] = 'svg';
  target['attrs'] = {
    width: data.shapeData.width,
    height: data.shapeData.height,
    viewBox: `${data.shapeData.x} ${data.shapeData.y} ${data.shapeData.width} ${data.shapeData.height}`,
    style: `transform: ${data.shapeData.shapeTransform};`,
  }
  target['children'] = buildGTree(data);
  return target;
};

const buildGTree = (data) => {
  const { opacity = 1, ...rest } = data.transformData;
  const transformAttrs = Object.keys(rest).map((key) => {
    return `${key}${rest[key]}`;
  }).join(' ');
  return [
    {
      type: 'g',
      attrs: {
        opacity: opacity,
        transform: transformAttrs,
      },
      children: buildPathNode(data),
    }
  ]
}

const buildPathNode = (data) => {
  return [{
    type: 'path',
    attrs: {
      ...data.fillData,
      d: data.path,
    }
  }]
}


export { buildSvgPath, buildClipPathTree, buildSvgContentTree };

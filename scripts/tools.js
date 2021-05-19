const data = {
    "i":[
        [
            158.604,
            -22.103
        ],
        [
            -4.447,
            -22.103
        ],
        [
            -8.105,
            104.813
        ],
        [
            36.189,
            111.458
        ],
        [
            59.833,
            113.365
        ],
        [
            110.525,
            110.946
        ],
        [
            158.604,
            110.146
        ]
    ],
    "o":[
        [
            158.604,
            -22.103
        ],
        [
            -4.447,
            -22.103
        ],
        [
            -8.105,
            104.813
        ],
        [
            36.189,
            111.458
        ],
        [
            93.859,
            113.67699999999999
        ],
        [
            110.525,
            110.946
        ],
        [
            158.604,
            110.146
        ]
    ],
    "v":[
        [
            158.604,
            -22.103
        ],
        [
            -4.447,
            -22.103
        ],
        [
            -8.105,
            104.813
        ],
        [
            36.189,
            111.458
        ],
        [
            70.285,
            113.461
        ],
        [
            110.525,
            110.946
        ],
        [
            158.604,
            110.146
        ]
    ],
    "c":true
};

const buildSvgPath = (data) => {
    const {i: pathData, o: pathNodes, v: viewData, c: closePath} = data;
    let pathString = ` M${viewData[0][0]},${viewData[0][1]}`;
    let i;
    let len = pathNodes.length;
    for (i = 1; i < len; i++) {
        pathString += ` C${pathNodes[i - 1][0]},${pathNodes[i - 1][1]} ${pathData[i][0]},${pathData[i][1]} ${viewData[i][0]},${viewData[i][1]}`;
    }
    if (closePath && len > 1) {
        pathString += ` C${pathNodes[i - 1][0]},${pathNodes[i - 1][1]} ${pathData[0][0]},${pathData[0][1]} ${viewData[0][0]},${viewData[0][1]}`;
    }
    return pathString;
}

console.log(buildSvgPath(data))
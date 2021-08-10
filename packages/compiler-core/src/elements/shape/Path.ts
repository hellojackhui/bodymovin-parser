class Path {

    isAnimated: boolean;
    isClosed: boolean;
    pathList: void;
    
    constructor(source) {
        this.buildShapePathModal(source);
    }
    buildShapePathModal(source) {
        const {a, k} = source;
        this.isAnimated = !!a;
        this.isClosed = k.c;
        this.pathList = this.buildPathList(k);
    }

    buildPathList(path) {
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

    output() {
        return {
            isAnimated: this.isAnimated,
            isClosed: this.isClosed,
            pathList: this.pathList,
          };
    }

}

export default Path;
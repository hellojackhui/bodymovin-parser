class Path {

    a: any;
    pathList: void;
    
    constructor(source) {
        this.buildPath(source);
    }
    buildPath(source) {
        const {a, k} = source;
        this.a = a;
        this.pathList = this.builPathList(k);
    }

    builPathList(path) {
        let i;
        let len = path.i.length;
        for (i = 0; i < len; i += 1) {
            path.i[i][0] += path.v[i][0];
            path.i[i][1] += path.v[i][1];
            path.o[i][0] += path.v[i][0];
            path.o[i][1] += path.v[i][1];
        }
    }
}

export default Path;
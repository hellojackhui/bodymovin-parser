declare namespace MpCompilerNS {
    interface MpCompilerClass {
        mode: typeof MpCompilerNS.MpCompilerMode;
        request: any;
        hooks: {[x: string]: () => {}};
        json: Object | string;
        options: MpCompilerOptions;
    }

    enum MpCompilerMode {
        CSS = 'css',
        ANIMATE = 'animate',
    }
    interface MpCompilerOptions {
        mode: keyof MpCompilerMode;
    }
}


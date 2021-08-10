export interface IAEAnimate {
    source: JSON | string;
    autoPlay: boolean;
    infinite: boolean;
    duration: number;
    onStart?: Function;
    onLoad?: Function;
    onFinish?: Function;
}

export interface IAESource {
    domTree: object;
    frames: object;
}

export interface IAEAnimateState {
    aeSource: IAESource;
}
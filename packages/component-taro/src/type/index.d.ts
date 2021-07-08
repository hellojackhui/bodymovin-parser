export interface IAEAnimate {
    source: JSON | string;
    autoPlay: boolean;
    infinite: boolean;
    duration: number;
    onStart?: Function;
    onLoad?: Function;
    onFinish?: Function;
}

export interface IAEAnimateState {
    tree: object;
}
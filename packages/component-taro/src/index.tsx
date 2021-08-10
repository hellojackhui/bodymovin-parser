import { IAEAnimate, IAEAnimateState } from './type/index';
import MpAnimateCompiler from '@bodymovin-parser/compiler-mp'
import { View, Image } from '@tarojs/components';
import Taro from "@tarojs/taro";
import { Component } from 'react';

export default class AEAnimate extends Component<IAEAnimate, IAEAnimateState> {

    static defaultProps = {
        source: '',
        autoPlay: true,
        infinite: true,
        duration: 1000,
    }

    source: string;
    autoPlay: boolean;
    infinite: boolean;
    duration: number;
    parserInstance: any;
    onStart?: Function;
    onLoad?: Function;
    onFinish?: Function;

    constructor(props) {
        super(props);
        this.state = {
            aeSource: {
                domTree: {},
                frames: {},
            }
        }
    }

    componentDidMount() {
        this.loadParserInstance();
        this.startAnimation();
    }

    loadParserInstance = () => {
        const { duration } = this.props;
        this.parserInstance = new MpAnimateCompiler({
            mode: 'animate',
            options: {
                duration,
            },
            request: (url) => {
                return new Promise((resolve, reject) => {
                    Taro.request({
                        url: url
                    }).then((data) => {
                        resolve(data.data);
                    }).catch(() => {
                        reject('');
                    })
                })
            }
        });
    }

    startAnimation = async() => {
        const { autoPlay, onStart, onLoad, onFinish } = this.props;
        if (!autoPlay) return;
        onStart && onStart();
        this.stopAnimation();
        const aeSource = await this.parserInstance.parseByUrl(this.props.source);
        this.setState({
            aeSource,
        }, () => {
            onLoad && onLoad();
            this.loadAEFrames(onFinish)
        })
    }

    loadAEFrames = (onFinish) => {
        const {aeSource: {frames}} = this.state;
        let frameLen = Object.keys(frames);
        const time1 = new Date().getTime();
        frameLen.forEach((key, index) => {
            let finished = 0;
            let selector = `#${key}`;
            let lastframes = frames[key].frames.map((item) => {
               return {
                    ...item,
                    ease: 'linear',
                    transformOrigin: frames[key].styles.transformOrigin,
               } 
            });
            this
            Taro.getCurrentInstance().page.animate(selector, lastframes, 1000, () => {
                finished += 1;
                if (finished === frameLen.length) {
                    const time2 = new Date().getTime();
                    onFinish && onFinish();
                    this.loop(time2 - time1);
                }
            })
        })
    }

    loop(range) {
        const { infinite = true, duration = 0 } = this.props;
        if (infinite) {
            setTimeout(() => {
                this.startAnimation();
            }, Math.max(duration - range, 0));
        }
    }

    stopAnimation() {
        const {aeSource: {frames}} = this.state;
        let frameLen = Object.keys(frames);
        frameLen.forEach((key) => {
            let selector = `#${key}`;
            Taro.getCurrentInstance().page.clearAnimation(selector, () => {})
        })
    }

    renderHtmlTree(obj) {
        const {class: className, id, style, type, children = []} = obj;
        if (!obj) return null;
        
        if (type === 'node') {
            return (
                <View id={id} style={style} className={className}>
                    {
                        children.map((item) => this.renderHtmlTree(item))
                    }
                </View>
            )
        } else if (type === 'image') {
            let srcUrlReg = style.backgroundImage.match(/^url\(([^)]+)\)/)
            delete style.backgroundImage;
            return (
                <Image id={id} src={srcUrlReg[1]} style={style} className={className}>
                    {
                        children.map((item) => this.renderHtmlTree(item))
                    }
                </Image>
            )
        }
    }

    render() {
        const {aeSource: {domTree}} = this.state;
        return (
            <View className="aeanimate-wrapper">
                {
                    this.renderHtmlTree(domTree)
                }
            </View>
        )
    }

}
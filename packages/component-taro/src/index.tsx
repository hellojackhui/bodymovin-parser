import { IAEAnimate, IAEAnimateState } from './type/index';
import MpAnimateCompiler from '@bodymovin-parser/compiler-mp'
import { View, Image } from '@tarojs/components';
import Taro, { PureComponent } from '@tarojs/taro';

export default class AEAnimate extends PureComponent<IAEAnimate, IAEAnimateState> {

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
    animateJSON: Object;
    onStart?: Function;
    onLoad?: Function;
    onFinish?: Function;

    constructor(props) {
        super(props);
        this.state = {
            tree: {}
        }
    }

    componentDidMount() {
        this.loadJSON();
        this.startAnimation();
    }


    async loadJSON() {
        const instance = new MpAnimateCompiler({
            mode: 'animate',
            request: (url) => {
                return new Promise((resolve, reject) => {
                    Taro.request({
                        url: url
                    }).then((data) => {
                        resolve(data);
                    }).catch(() => {
                        reject('');
                    })
                })
            }
        });
        this.animateJSON = await instance.parseByUrl(this.props.source);
        console.log('json', this.animateJSON);
    }

    startAnimation() {
        const { autoPlay, onStart, onFinish, duration } = this.props;
        if (!autoPlay) return;
        onStart();
        if (!this.$scope.animate) {
            setTimeout(onFinish, duration || 100);
            return;
        }
        this.stopAnimation();
    }

    stopAnimation() {
        //TODO...
    }

    render() {
        return (
            <View class="aeanimate-wrapper">
                ae渲染区域
            </View>
        )
    }

}
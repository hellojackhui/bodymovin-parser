/**
 * @author 惠嘉伟
 * @email huijiawei@meituan.com
 * @create date 2021-08-09 13:35:59
 * @modify date 2021-08-09 13:36:27
 * @desc 基于bodymovin-parser的react动效播放组件
 */

import { useState, useEffect } from "react";
import MpCompiler from '@bodymovin-parser/compiler-mp';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const delay = (duration) => setTimeout(() => {
  Promise.resolve();
}, duration);

const isValidate = json => typeof json === 'object' && Object.keys(json).length > 0;

function AnimeComponent(props) {
  
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [domTree, setDomTree] = useState({});
  const [cssFrames, setCssFrames] = useState({});

  useEffect(() => {
    if (props.json) {
      loadAnimation({
        json: props.json,
      });
    }
    setPlaying(props.playing);
  }, []);

  useEffect(() => {
    if (props.playing !== playing) {
      if (props.playing) {
        loadAnimation({
          json: props.json,
        });
      } else {
        pauseAnimation();
      }
    }
    setPlaying(props.playing);
  }, [props.playing])
  


  async function loadAnimation(options) {
    if (!isValidate(props.json)) return;
    if (loaded) return restartAnimation();
    const { domTree, cssFrames } = await getAnimationData(options);
    setDomTree(domTree);
    setCssFrames(cssFrames);
    await delay(1000);
    await renderCssAnimation(cssFrames);
  }

  async function getAnimationData(options) {
    const MpCompilerInst = new MpCompiler({
      mode: 'animate',
    })
    const data = await Promise.resolve(MpCompilerInst.parseByJson(options.json));
    console.log('data', data);
    return {
      domTree: data.domTree,
      cssFrames: data.frames,
    }
  }

  // 动画属性格式转换
  function formatFrames(datas) {
    return datas.map((data) => {
      let res = {
        transform: "",
      };
      if (hasOwnProperty.call(data, "translate3d")) {
        const [a1, a2, a3] = data["translate3d"];
        res["transform"] = `translate3d(${a1}, ${a2}, ${a3})`;
      }
      if (hasOwnProperty.call(data, "scale3d")) {
        const [a1, a2, a3] = data["scale3d"];
        res["transform"] += ` scale3d(${a1}, ${a2}, ${a3})`;
      }
      if (hasOwnProperty.call(data, "rotate")) {
        res["transform"] += ` rotate(${data["rotate"]}deg)`;
      }
      if (hasOwnProperty.call(data, "opacity")) {
        res["opacity"] = data["opacity"];
      }
      return res;
    });
  }

  async function renderCssAnimation(data) {
    if (!data && !Object.keys(data).length) return;
    const source = (!cssFrames || !Object.keys(cssFrames).length) ? data : cssFrames;
    Object.keys(source).forEach((key) => {
      document.getElementById(key).animate(formatFrames(source[key].frames), {
        duration: source[key].duration * 1000,
        iterations: props.counts || Infinity,
      })
    })
    setLoaded(true);
    props.onPlay && props.onPlay();
    return null;
  }
  

  function pauseAnimation() {
    const source = (!cssFrames || !Object.keys(cssFrames).length) ? {} : cssFrames;
    Object.keys(source).forEach((key) => {
      // element.animate不支持直接关闭动画，需要基于animation进行操作
      const animeList = document.getElementById(key).getAnimations();
      animeList.forEach((anime) => anime.pause());
    })
    props.onPause && props.onPause();
  }

  function stopAnimation() {
    const source = (!cssFrames || !Object.keys(cssFrames).length) ? {} : cssFrames;
    Object.keys(source).forEach((key) => {
      // element.animate不支持直接关闭动画，需要基于animation进行操作
      const animeList = document.getElementById(key).getAnimations();
      animeList.forEach((anime) => anime.finish());
    })
  }

  function restartAnimation() {
    const source = (!cssFrames || !Object.keys(cssFrames).length) ? {} : cssFrames;
    Object.keys(source).forEach((key) => {
      // element.animate不支持直接关闭动画，需要基于animation进行操作
      const animeList = document.getElementById(key).getAnimations();
      animeList.forEach((anime) => anime.play());
    })
  }

  function renderDivContent(domTree) {
    if (!domTree || !Object.keys(domTree).length) return (<div></div>) 
    const children = domTree.children ? [...domTree.children].reverse() : [];
    if (!domTree) return null;
    return (
      <div
        className={domTree.class}
        id={domTree._id}
        key={domTree._id}
        style={domTree.style}
      >
        {
          children.map((item) => renderDivContent(item))
        }
      </div>
    )
  }


  return (
    <div className="web-wrapper">
      {renderDivContent(domTree)}
    </div>
  );
}

AnimeComponent.defaultProps = {
  json: {},
  playing: true,
  counts: 'Infinity'
}

export default AnimeComponent;

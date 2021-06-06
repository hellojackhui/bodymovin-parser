// index.js
// 获取应用实例
const app = getApp()
const protoStr = Object.prototype.toString;

Page({
  data: {

  },
  onLoad() {
    this.loadanime()
  },
  isEqual(from, to, keys) {
    if (protoStr.call(from) !== protoStr.call(to)) {
      return false;
    }
    if (typeof from !== 'object' && typeof to !== 'object') {
      return from === to;
    }
    let fromKeys = Array.isArray(from) ? from : Object.keys(from);
    let toKeys = Array.isArray(to) ? to : Object.keys(to);
    if (fromKeys.length !== toKeys.length) {
      return false;
    }
    let res = true;
    for (let i = 0; i < fromKeys.length; i++) {
      let key = fromKeys[i];
      if (keys && keys.includes(key)) continue;
      if (Array.isArray(from)) {
        res = this.isEqual(fromKeys[i], to[i], keys)
      } else {
        res = this.isEqual(from[key], to[key], keys)
      }
      if (!res) break;
    }
    if (!res) return false;
    return true;
  },
  loadanime() {
    this.animate('#image_0', [{
        offset: 0,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 14
      },
      {
        offset: 0.0417,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 13.7
      },
      {
        offset: 0.0833,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 12.71
      },
      {
        offset: 0.125,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 11.36
      },
      {
        offset: 0.1667,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 9.66
      },
      {
        offset: 0.2083,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 7.45
      },
      {
        offset: 0.25,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 5.3
      },
      {
        offset: 0.2917,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 3.1
      },
      {
        offset: 0.3333,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 0.65
      },
      {
        offset: 0.375,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: -1.4
      },
      {
        offset: 0.4167,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: -3.24
      },
      {
        offset: 0.4583,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: -4.93
      },
      {
        offset: 0.5,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: -6
      },
      {
        offset: 0.5417,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: -6.34
      },
      {
        offset: 0.5833,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: -5.68
      },
      {
        offset: 0.625,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: -4.34
      },
      {
        offset: 0.6667,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: -2.45
      },
      {
        offset: 0.7083,

        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 0.15
      },
      {
        offset: 0.75,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 2.7
      },
      {
        offset: 0.7917,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 5.31
      },
      {
        offset: 0.8333,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 8.14
      },
      {
        offset: 0.875,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 10.38
      },
      {
        offset: 0.9167,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 12.21
      },
      {
        offset: 0.9583,
        translate3d: ['0px', '0px', '0px'],
        scale3d: ['1', '1', '1'],
        rotate: 13.57
      }
    ], 1000, () => {
      console.log('aaa');
      this.loadanime();
    })
  },
  callback() {
    console.log('end')
  }
})
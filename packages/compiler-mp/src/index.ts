/**
 * @author 惠嘉伟
 * @email huijiawei@meituan.com
 * @create date 2021-05-19 17:37:31
 * @modify date 2021-05-19 17:37:31
 * @desc Miniprogram compiler
 */

import ParserCore from '@bodymovin-parser/compiler-core';
import './index.d';


class MpAnime {

    mode: typeof MpCompiler.MpCompilerMode;
    request: any;
    hooks: {[x: string]: () => {}};
    json: Object | string;

    constructor(config) {
        const { request, hooks, mode } = config;
        this.mode = mode;
        this.request = request;
        this.hooks = hooks;
    }

    parseByJson(json) {
        this.json = json;
    }

    parseByUrl(url) {
        if (this.request) {
            this.request(url).then((json) => {
                console.log(json);
            })
        }
    }

}

export default MpAnime;
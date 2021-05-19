"use strict";
/**
 * @author 惠嘉伟
 * @email huijiawei@meituan.com
 * @create date 2021-05-19 17:37:31
 * @modify date 2021-05-19 17:37:31
 * @desc Miniprogram compiler
 */
exports.__esModule = true;
require("./index.d");
var MpAnime = /** @class */ (function () {
    function MpAnime(config) {
        var request = config.request, hooks = config.hooks, mode = config.mode;
        this.mode = mode;
        this.request = request;
        this.hooks = hooks;
    }
    MpAnime.prototype.parseByJson = function (json) {
        this.json = json;
    };
    MpAnime.prototype.parseByUrl = function (url) {
        if (this.request) {
            this.request(url).then(function (json) {
                console.log(json);
            });
        }
    };
    return MpAnime;
}());
exports["default"] = MpAnime;

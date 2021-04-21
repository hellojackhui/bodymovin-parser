(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    function init() {
        console.log('js');
    }
    module.exports = init;

})));

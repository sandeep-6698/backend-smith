"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFieldArgsHepler = void 0;
var formatFieldArgsHepler = function (fields) {
    return fields.join(' ').match(/(\*?\w+:\{[^}]+\})|(\*?\w+:\[[^\]]+\])|(\*?\w+:\w+)/g) || [];
};
exports.formatFieldArgsHepler = formatFieldArgsHepler;

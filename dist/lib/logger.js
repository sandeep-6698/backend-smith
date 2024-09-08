"use strict";
// import chalk from "chalk";
Object.defineProperty(exports, "__esModule", { value: true });
var info = function (message) {
    console.log(message);
};
var error = function (message) {
    console.error(message);
};
var warn = function (message) {
    console.warn(message);
};
var logger = {
    info: info,
    error: error,
    warn: warn
};
exports.default = logger;

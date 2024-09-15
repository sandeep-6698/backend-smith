"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommandHelper = void 0;
var child_process_1 = require("child_process");
var runCommandHelper = function (command) {
    return new Promise(function (res, rej) {
        (0, child_process_1.exec)(command, function (error) {
            if (error) {
                rej(error);
            }
            res(true);
        });
    });
};
exports.runCommandHelper = runCommandHelper;

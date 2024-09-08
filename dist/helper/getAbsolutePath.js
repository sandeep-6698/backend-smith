"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsolutePath = void 0;
var path_1 = __importDefault(require("path"));
var getAbsolutePath = function (module) {
    var folderPath = path_1.default.join(process.cwd(), 'app', module);
    return folderPath;
};
exports.getAbsolutePath = getAbsolutePath;

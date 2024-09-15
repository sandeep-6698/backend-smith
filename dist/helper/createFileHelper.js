"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileHepler = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var getAbsolutePath_1 = require("./getAbsolutePath");
var logger_1 = __importDefault(require("../lib/logger"));
var runCommandHelper_1 = require("./runCommandHelper");
var createFileHepler = function (module, type, content) {
    var folderPath = (0, getAbsolutePath_1.getAbsolutePath)(module);
    var filePath = path_1.default.join(folderPath, "".concat(module, ".").concat(type, ".ts"));
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, content);
        logger_1.default.info("Created ".concat(type));
        (0, runCommandHelper_1.runCommandHelper)("npx prettier . -w");
    }
    else {
        logger_1.default.warn("File already exists: ".concat(filePath));
    }
};
exports.createFileHepler = createFileHepler;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolderHeplder = void 0;
var fs_1 = __importDefault(require("fs"));
var getAbsolutePath_1 = require("./getAbsolutePath");
var logger_1 = __importDefault(require("../lib/logger"));
var createFolderHeplder = function (module) {
    var folderPath = (0, getAbsolutePath_1.getAbsolutePath)(module);
    // Check if the folder already exists
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath);
        logger_1.default.info("Module created: ".concat(module));
    }
    else {
        logger_1.default.warn("Module already exists: ".concat(module));
    }
};
exports.createFolderHeplder = createFolderHeplder;

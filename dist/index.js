#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("./lib/logger"));
var node_process_1 = require("node:process");
var formatFieldArgsHepler_1 = require("./helper/formatFieldArgsHepler");
var createModule_1 = require("./lib/createModule");
var createSchema_1 = require("./lib/createSchema");
var createRoute_1 = require("./lib/createRoute");
var createService_1 = require("./lib/createService");
var createController_1 = require("./lib/createController");
var createValidation_1 = require("./lib/createValidation");
var createDto_1 = require("./lib/createDto");
var createFolderHelper_1 = require("./helper/createFolderHelper");
var createBase_1 = require("./lib/createBase");
function init() {
    var _0 = node_process_1.argv[0], _1 = node_process_1.argv[1], operation = node_process_1.argv[2], _a = node_process_1.argv[3], name = _a === void 0 ? '' : _a, rest = node_process_1.argv.slice(4);
    var fields = (0, formatFieldArgsHepler_1.formatFieldArgsHepler)(rest);
    if (!operation) {
        logger_1.default.error("Operation is required!");
        return;
    }
    if (!name) {
        logger_1.default.error("Name is required!");
        return;
    }
    switch (operation) {
        case 'create':
            (0, createBase_1.createBase)(name);
            break;
        case 'create:module':
            (0, createFolderHelper_1.createFolderHeplder)(name);
            (0, createModule_1.createModule)(name, fields);
            break;
        case 'create:schema':
            (0, createFolderHelper_1.createFolderHeplder)(name);
            (0, createSchema_1.createSchema)(name, fields);
            break;
        case 'create:route':
            (0, createFolderHelper_1.createFolderHeplder)(name);
            (0, createRoute_1.createRoute)(name);
            break;
        case 'create:service':
            (0, createFolderHelper_1.createFolderHeplder)(name);
            (0, createService_1.createService)(name);
            break;
        case 'create:controller':
            (0, createFolderHelper_1.createFolderHeplder)(name);
            (0, createController_1.createController)(name);
            break;
        case 'create:validation':
            (0, createFolderHelper_1.createFolderHeplder)(name);
            (0, createValidation_1.createValidation)(name, fields);
            break;
        case 'create:dto':
            (0, createFolderHelper_1.createFolderHeplder)(name);
            (0, createDto_1.createDto)(name, fields);
            break;
        default:
            logger_1.default.warn("Invalid ".concat(operation, " operation"));
    }
}
init();

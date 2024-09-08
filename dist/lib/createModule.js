"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModule = createModule;
var createSchema_1 = require("./createSchema");
var createValidation_1 = require("./createValidation");
var createDto_1 = require("./createDto");
var createService_1 = require("./createService");
var createController_1 = require("./createController");
var createRoute_1 = require("./createRoute");
function createModule(module, fields) {
    (0, createDto_1.createDto)(module, fields);
    (0, createSchema_1.createSchema)(module, fields);
    (0, createValidation_1.createValidation)(module, fields);
    (0, createService_1.createService)(module);
    (0, createController_1.createController)(module);
    (0, createRoute_1.createRoute)(module);
}

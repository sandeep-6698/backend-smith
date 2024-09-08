"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createController = void 0;
var createFileHelper_1 = require("../helper/createFileHelper");
var controllerTemplate_1 = require("../templates/controllerTemplate");
var createController = function (module) {
    var template = (0, controllerTemplate_1.controllerTemplate)(module);
    (0, createFileHelper_1.createFileHepler)(module, 'controller', template);
};
exports.createController = createController;

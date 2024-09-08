"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = void 0;
var createFileHelper_1 = require("../helper/createFileHelper");
var serviceTemplate_1 = require("../templates/serviceTemplate");
var createService = function (module) {
    var template = (0, serviceTemplate_1.serviceTemplate)(module);
    (0, createFileHelper_1.createFileHepler)(module, 'service', template);
};
exports.createService = createService;

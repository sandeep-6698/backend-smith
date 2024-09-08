"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidation = void 0;
var createFileHelper_1 = require("../helper/createFileHelper");
var validationTemplate_1 = require("../templates/validationTemplate");
var createValidation = function (module, fields) {
    var template = (0, validationTemplate_1.validationTemplate)(module, fields);
    (0, createFileHelper_1.createFileHepler)(module, 'validation', template);
};
exports.createValidation = createValidation;

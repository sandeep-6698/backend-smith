"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
var createFileHelper_1 = require("../helper/createFileHelper");
var schemaTemplate_1 = require("../templates/schemaTemplate");
var createSchema = function (module, fields) {
    var template = (0, schemaTemplate_1.schemaTemplate)(module, fields);
    (0, createFileHelper_1.createFileHepler)(module, 'schema', template);
};
exports.createSchema = createSchema;

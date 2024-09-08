"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDto = void 0;
var createFileHelper_1 = require("../helper/createFileHelper");
var dtoTemplate_1 = require("../templates/dtoTemplate");
var createDto = function (module, fields) {
    var template = (0, dtoTemplate_1.dtoTemplate)(module, fields);
    (0, createFileHelper_1.createFileHepler)(module, 'dto', template);
};
exports.createDto = createDto;

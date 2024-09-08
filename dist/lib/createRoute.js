"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoute = void 0;
var createFileHelper_1 = require("../helper/createFileHelper");
var routeTemplate_1 = require("../templates/routeTemplate");
var createRoute = function (module) {
    var template = (0, routeTemplate_1.routeTemplate)(module);
    (0, createFileHelper_1.createFileHepler)(module, 'route', template);
};
exports.createRoute = createRoute;

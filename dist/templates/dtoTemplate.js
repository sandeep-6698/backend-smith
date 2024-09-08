"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dtoTemplate = void 0;
var parseFieldsHelper_1 = require("../helper/parseFieldsHelper");
var toPascalCase_1 = require("../helper/toPascalCase");
var toTypes = function (fields) {
    return "".concat(Object.entries(fields).map(function (_a) {
        var key = _a[0], value = _a[1];
        var type = value.type, required = value.required;
        var isArray = Array.isArray(type);
        var parsedType = typeof type == 'string' ? type.toLowerCase() : isArray && typeof type[0] == 'string' ? "".concat(type[0].toLowerCase()) : "I".concat((0, toPascalCase_1.toPascalCase)(key));
        return "".concat(key).concat(required ? '' : '?', ": ").concat(parsedType).concat(isArray ? '[]' : '');
    }).join(';\n'));
};
var dtoTemplate = function (module, fields) {
    var name = (0, toPascalCase_1.toPascalCase)(module);
    var parsedFields = (0, parseFieldsHelper_1.parseFieldsHelper)(fields);
    var getNestedTypes = function () {
        var types = [];
        Object.entries(parsedFields).forEach(function (_a) {
            var field = _a[0], type = _a[1].type;
            if (Array.isArray(type) && typeof type[0] !== 'string') {
                var name_1 = (0, toPascalCase_1.toPascalCase)(field);
                types.push("\n                    export interface I".concat(name_1, " {\n                        ").concat(toTypes(type[0]), "\n                    }\n                "));
            }
            else if (typeof type === 'object' && !Array.isArray(type)) {
                var name_2 = (0, toPascalCase_1.toPascalCase)(field);
                types.push("\n                    export interface I".concat(name_2, " {\n                        ").concat(toTypes(type), "\n                    }\n                "));
            }
        });
        return types;
    };
    return "\n        import { type BaseSchema } from \"../common/dto/base.dto\";\n        \n        ".concat(getNestedTypes().join('\n'), "\n\n        export interface I").concat(name, " extends BaseSchema {\n            ").concat(toTypes(parsedFields), "\n        }\n    ");
};
exports.dtoTemplate = dtoTemplate;

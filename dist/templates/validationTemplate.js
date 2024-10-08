"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationTemplate = void 0;
var parseFieldsHelper_1 = require("../helper/parseFieldsHelper");
var toPascalCase_1 = require("../helper/toPascalCase");
// Function to generate validation for a schema recursively
function generateValidations(schema, parentKey, required) {
    if (parentKey === void 0) { parentKey = ''; }
    if (required === void 0) { required = true; }
    var validationCode = '\n';
    for (var _i = 0, _a = Object.entries(schema); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var fieldKey = parentKey ? "".concat(parentKey, ".").concat(key) : key;
        var validationLine = " body('".concat(fieldKey, "')");
        if (value.required && required) {
            validationLine += ".notEmpty().withMessage('".concat(fieldKey, " is required')");
        }
        if (Array.isArray(value.type)) {
            var type = value.type[0];
            if (typeof type === 'string') {
                if (type === 'String') {
                    validationLine += ".isArray().withMessage('".concat(fieldKey, " must be an array')");
                    validationLine += ".bail()";
                    if (value.enum) {
                        validationLine += ".custom((value) => {\n                                                if (value.some(item => [\"".concat(value.enum.join('", "'), "\"].includes(item))) {\n                                                    throw new Error('Each item in ").concat(fieldKey, " must be in [").concat(value.enum.join(', '), "].');\n                                                }\n                                                return true;\n                                            })\n                                        ");
                    }
                    else {
                        validationLine += ".custom((value) => {\n                                                if (value.some(item => typeof item !== 'string')) {\n                                                    throw new Error('Each item in ".concat(fieldKey, " must be a string.');\n                                                }\n                                                return true;\n                                            })\n                                        ");
                    }
                }
                else if (type === 'Number') {
                    validationLine += ".isArray().withMessage('".concat(fieldKey, " must be an array')");
                    validationLine += ".bail()";
                    validationLine += ".custom((value) => {\n                                            if (value.some(item => typeof item !== 'number')) {\n                                                throw new Error('Each item in ".concat(fieldKey, " must be a string.');\n                                            }\n                                            return true;\n                                        })\n                                    ");
                }
                else if (type === 'Boolean') {
                    validationLine += ".isArray().withMessage('".concat(fieldKey, " must be an array')");
                    validationLine += ".custom((value) => {\n                                            if (value.some(item => typeof item !== 'boolean')) {\n                                                throw new Error('Each item in ".concat(fieldKey, " must be a string.');\n                                            }\n                                            return true;\n                                        })\n                                    ");
                }
            }
            else if (typeof type === 'object') {
                // For nested array of objects
                validationCode += generateValidations(type, "".concat(fieldKey, ".*"), required);
                continue;
            }
        }
        else if (typeof value.type === 'string') {
            if (value.type === 'String') {
                validationLine += ".isString().withMessage('".concat(fieldKey, " must be a string')");
                if (value.enum) {
                    validationLine += ".custom((value) => {\n                                                if ([\"".concat(value.enum.join('", "'), "\"].includes(value)) {\n                                                    throw new Error('").concat(fieldKey, " must be in [").concat(value.enum.join(', '), "].');\n                                                }\n                                                return true;\n                                            })\n                                        ");
                }
            }
            else if (value.type === 'Number') {
                validationLine += ".isNumeric().withMessage('".concat(fieldKey, " must be a number')");
            }
            else if (value.type === 'Boolean') {
                validationLine += ".isBoolean().withMessage('".concat(fieldKey, " must be a boolean')");
            }
        }
        else if (typeof value.type === 'object') {
            // Handle nested objects
            validationCode += generateValidations(value.type, fieldKey, required);
            continue;
        }
        validationCode += validationLine.trim() + ",\n";
    }
    return validationCode;
}
var validationTemplate = function (module, fields) {
    var parsedFields = (0, parseFieldsHelper_1.parseFieldsHelper)(fields);
    var name = (0, toPascalCase_1.toPascalCase)(module);
    return "\n    import { body } from 'express-validator';\n    \n    export const create".concat(name, " = [").concat(generateValidations(parsedFields), "];\n\n    export const update").concat(name, " = [").concat(generateValidations(parsedFields), "];\n\n    export const edit").concat(name, " = [").concat(generateValidations(parsedFields, '', false), "];\n    ");
};
exports.validationTemplate = validationTemplate;

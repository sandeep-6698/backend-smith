"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFieldsHelper = void 0;
var possibleFields = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
};
var getName = function (field) {
    var firstColonIndex = field.indexOf(':');
    var name = field.substring(0, firstColonIndex);
    if (name.charAt(0) === '*') {
        return { name: name.slice(1), required: true };
    }
    return { name: name, required: false };
};
var getType = function (field) {
    var firstColonIndex = field.indexOf(':');
    var value = field.substring(firstColonIndex + 1);
    if (['[', '{'].includes(value.charAt(0))) {
        var fields = value.slice(1, -1);
        if (possibleFields[fields]) {
            return { type: [fields] };
        }
        else {
            if (value.includes('|')) {
                return { type: ["String"], enum: fields.split("|") };
            }
            var result = (0, exports.parseFieldsHelper)(fields.split(' '));
            if (value.charAt(0) == '[')
                return { type: [result] };
            return { type: result };
        }
    }
    if (value.includes('|')) {
        return { type: "String", enum: value.split("|") };
    }
    return { type: value };
};
var parseFieldsHelper = function (fields) {
    var result = {};
    fields.forEach(function (field) {
        var _a = getName(field), name = _a.name, required = _a.required;
        var _b = getType(field), type = _b.type, enumTypes = _b.enum;
        result[name] = { type: type, required: required };
        if (enumTypes) {
            result[name].enum = enumTypes;
        }
    });
    return result;
};
exports.parseFieldsHelper = parseFieldsHelper;

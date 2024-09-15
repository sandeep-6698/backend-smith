"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaTemplate = void 0;
var parseFieldsHelper_1 = require("../helper/parseFieldsHelper");
var toPascalCase_1 = require("../helper/toPascalCase");
var schemaTemplate = function (module, fields) {
    var parsedFields = (0, parseFieldsHelper_1.parseFieldsHelper)(fields);
    var name = (0, toPascalCase_1.toPascalCase)(module);
    var types = [];
    var toSchema = function (fields) {
        var result = '{';
        Object.entries(fields).forEach(function (_a) {
            var key = _a[0], field = _a[1];
            if (typeof field.type === 'string') {
                result += "".concat(key, ": { type: ").concat(field.type, ", required: ").concat(field.required, " ").concat(field.enum ? ", enum: [\"".concat(field.enum.join('", "'), "\"]") : '', "},").concat('\n');
            }
            else if (Array.isArray(field.type)) {
                if (typeof field.type[0] === 'string') {
                    if (field.enum) {
                        result += "".concat(key, ": { type: [").concat(field.type[0], "], required: ").concat(field.required, " ").concat(field.enum ? ", enum: [\"".concat(field.enum.join('", "'), "\"]") : '', "},").concat('\n');
                    }
                    else {
                        result += "".concat(key, ": [{ type: ").concat(field.type[0], ", required: ").concat(field.required, "}],").concat('\n');
                    }
                }
                else {
                    var name_1 = (0, toPascalCase_1.toPascalCase)(key);
                    types.push("I".concat(name_1));
                    result += "".concat(key, ": [new Schema<I").concat(name_1, ">(").concat(toSchema(field.type[0]), ", { timestamps: false, _id: false })],").concat('\n');
                }
            }
            else if (typeof field.type === 'object' && !Array.isArray(field.type) && field.type != null) {
                var name_2 = (0, toPascalCase_1.toPascalCase)(key);
                types.push("I".concat(name_2));
                result += "".concat(key, ": new Schema<I").concat(name_2, ">(").concat(toSchema(field.type), ", { timestamps: false, _id: false }),").concat('\n');
            }
        });
        result += '}';
        return result;
    };
    var schemaString = toSchema(parsedFields);
    return "\n        import mongoose from \"mongoose\";\n        import { type I".concat(name, " ").concat(types.length ? ",".concat(types.join(', '), " ") : '', " } from \"./").concat(module, ".dto\";\n        \n        const Schema = mongoose.Schema;\n\n        const ").concat(name, "Schema = new Schema<I").concat(name, ">(").concat(schemaString, ", { timestamps: true });\n    \n        export default mongoose.model<I").concat(name, ">(\"").concat(module, "\", ").concat(name, "Schema);\n    ");
};
exports.schemaTemplate = schemaTemplate;

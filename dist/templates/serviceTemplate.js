"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceTemplate = void 0;
var toPascalCase_1 = require("../helper/toPascalCase");
var serviceTemplate = function (module) {
    var name = (0, toPascalCase_1.toPascalCase)(module);
    return "\n            import {type I".concat(name, "} from \"./").concat(module, ".dto\";\n            import ").concat(name, "Schema from \"./").concat(module, ".schema\";\n\n            export const create").concat(name, " = async (data: I").concat(name, ") => {\n                const result = await ").concat(name, "Schema.create({ ...data, active: true });\n                return result;\n            };\n\n            export const update").concat(name, " = async (id: string, data: I").concat(name, ") => {\n                const result = await ").concat(name, "Schema.findOneAndUpdate({ _id: id }, data, {\n                    new: true,\n                });\n                return result;\n            };\n\n            export const edit").concat(name, " = async (id: string, data: Partial<I").concat(name, ">) => {\n                const result = await ").concat(name, "Schema.findOneAndUpdate({ _id: id }, data);\n                return result;\n            };\n\n            export const delete").concat(name, " = async (id: string) => {\n                const result = await ").concat(name, "Schema.deleteOne({ _id: id });\n                return result;\n            };\n\n            export const get").concat(name, "ById = async (id: string) => {\n                const result = await ").concat(name, "Schema.findById(id).lean();\n                return result;\n            };\n\n            export const getAll").concat(name, " = async () => {\n                const result = await ").concat(name, "Schema.find({}).lean();\n                return result;\n            };\n");
};
exports.serviceTemplate = serviceTemplate;
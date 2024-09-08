"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeTemplate = void 0;
var toKebabCase_1 = require("../helper/toKebabCase");
var toPascalCase_1 = require("../helper/toPascalCase");
var routeTemplate = function (module) {
    var pName = (0, toPascalCase_1.toPascalCase)(module);
    var kName = (0, toKebabCase_1.toKebabCase)(module);
    return "\n        import { Router } from \"express\";\n        import { catchError } from \"../common/middleware/cath-error.middleware\";\n        import * as ".concat(kName, "Controller from \"./").concat(module, ".controller\";\n        import * as ").concat(kName, "Validator from \"./").concat(module, ".validation\";\n\n        const router = Router();\n        \n        router\n        .get(\"/\", ").concat(kName, "Controller.getAll").concat(pName, ")\n        .get(\"/:id\", ").concat(kName, "Controller.get").concat(pName, "ById)\n        .delete(\"/:id\", ").concat(kName, "Controller.delete").concat(pName, ")\n        .post(\"/\", ").concat(kName, "Validator.create").concat(pName, " ,catchError, ").concat(kName, "Controller.create").concat(pName, ")\n        .put(\"/:id\", ").concat(kName, "Validator.update").concat(pName, ", catchError, ").concat(kName, "Controller.update").concat(pName, ")\n        .patch(\"/:id\", ").concat(kName, "Validator.edit").concat(pName, ", catchError, ").concat(kName, "Controller.edit").concat(pName, ")\n\n        export default router;\n    \n    ");
};
exports.routeTemplate = routeTemplate;

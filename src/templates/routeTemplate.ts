import { toKebabCase } from "../helper/toKebabCase"
import { toPascalCase } from "../helper/toPascalCase";
import { parseFieldsHelper } from "../helper/parseFieldsHelper";
import { swaggerSchemaTemplate, swaggerOperationTemplate } from "./swaggerTemplate";

const pluralize = (word: string) => word.endsWith('s') ? word : `${word}s`;

export const routeTemplate = (module: string, fields: string[] = []) => {
    const pName = toPascalCase(module);
    const basePath = `/${pluralize(toKebabCase(module))}`;
    const parsedFields = fields.length ? parseFieldsHelper(fields) : null;
    const hasSchema = parsedFields !== null;

    return `
        import { Router } from "express";
        import { catchError } from "@common/middleware/cath-error.middleware";
        import * as ${pName}Controller from "./${module}.controller";
        import * as ${pName}Validator from "./${module}.validation";

        const router = Router();

        ${hasSchema ? swaggerSchemaTemplate(pName, parsedFields!) : ''}

        ${swaggerOperationTemplate(pName, basePath, hasSchema, { method: 'get', path: '', summary: `Get all ${pName}`, hasBody: false, response: 'paginated' })}
        router.get("/", ${pName}Controller.getAll${pName});

        ${swaggerOperationTemplate(pName, basePath, hasSchema, { method: 'get', path: '/{id}', summary: `Get ${pName} by id`, hasBody: false, response: 'single' })}
        router.get("/:id", ${pName}Controller.get${pName}ById);

        ${swaggerOperationTemplate(pName, basePath, hasSchema, { method: 'delete', path: '/{id}', summary: `Delete ${pName} by id`, hasBody: false, response: 'none' })}
        router.delete("/:id", ${pName}Controller.delete${pName});

        ${swaggerOperationTemplate(pName, basePath, hasSchema, { method: 'post', path: '', summary: `Create ${pName}`, hasBody: true, response: 'single' })}
        router.post("/", ${pName}Validator.create${pName}, catchError, ${pName}Controller.create${pName});

        ${swaggerOperationTemplate(pName, basePath, hasSchema, { method: 'put', path: '/{id}', summary: `Replace ${pName} by id`, hasBody: true, response: 'single' })}
        router.put("/:id", ${pName}Validator.update${pName}, catchError, ${pName}Controller.update${pName});

        ${swaggerOperationTemplate(pName, basePath, hasSchema, { method: 'patch', path: '/{id}', summary: `Update ${pName} by id`, hasBody: true, response: 'single' })}
        router.patch("/:id", ${pName}Validator.edit${pName}, catchError, ${pName}Controller.edit${pName});

        export default router;
    `
}
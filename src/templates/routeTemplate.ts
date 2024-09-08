import { toKebabCase } from "../helper/toKebabCase"
import { toPascalCase } from "../helper/toPascalCase";

export const routeTemplate = (module: string) => {
    const pName = toPascalCase(module);
    const kName = toKebabCase(module);

    return `
        import { Router } from "express";
        import { catchError } from "../common/middleware/cath-error.middleware";
        import * as ${kName}Controller from "./${module}.controller";
        import * as ${kName}Validator from "./${module}.validation";

        const router = Router();
        
        router
        .get("/", ${kName}Controller.getAll${pName})
        .get("/:id", ${kName}Controller.get${pName}ById)
        .delete("/:id", ${kName}Controller.delete${pName})
        .post("/", ${kName}Validator.create${pName} ,catchError, ${kName}Controller.create${pName})
        .put("/:id", ${kName}Validator.update${pName}, catchError, ${kName}Controller.update${pName})
        .patch("/:id", ${kName}Validator.edit${pName}, catchError, ${kName}Controller.edit${pName})

        export default router;
    
    `
}
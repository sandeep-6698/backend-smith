import { toKebabCase } from "../helper/toKebabCase";
import { toPascalCase } from "../helper/toPascalCase"

export const controllerTemplate = (module: string) => {
    const pName = toPascalCase(module);
    const kName = toKebabCase(module);
    return `
            import * as ${kName}Service from "./${module}.service";
            import { createResponse } from "../common/helper/response.hepler";
            import asyncHandler from "express-async-handler";
            import { type Request, type Response } from 'express'

            export const create${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${kName}Service.create${pName}(req.body);
                res.send(createResponse(result, "${pName} created sucssefully"))
            });

            export const update${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${kName}Service.update${pName}(req.params.id, req.body);
                res.send(createResponse(result, "${pName} updated sucssefully"))
            });

            export const edit${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${kName}Service.edit${pName}(req.params.id, req.body);
                res.send(createResponse(result, "${pName} updated sucssefully"))
            });

            export const delete${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${kName}Service.delete${pName}(req.params.id);
                res.send(createResponse(result, "${pName} deleted sucssefully"))
            });


            export const get${pName}ById = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${kName}Service.get${pName}ById(req.params.id);
                res.send(createResponse(result))
            });


            export const getAll${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${kName}Service.getAll${pName}();
                res.send(createResponse(result))
            });
`
}
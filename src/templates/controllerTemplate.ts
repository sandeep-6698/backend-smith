import { toPascalCase } from "../helper/toPascalCase"

export const controllerTemplate = (module: string) => {
    const pName = toPascalCase(module);
    return `
            import * as ${pName}Service from "./${module}.service";
            import { NotFoundError } from "@common/errors";
            import { createPaginatedResponse, createResponse } from "@common/helper/response.hepler";
            import asyncHandler from "express-async-handler";
            import { type Request, type Response } from 'express'

            export const create${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${pName}Service.create${pName}(req.body);
                res.send(createResponse(result, "${pName} created successfully"))
            });

            export const update${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${pName}Service.update${pName}(req.params.id, req.body);
                res.send(createResponse(result, "${pName} updated successfully"))
            });

            export const edit${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${pName}Service.edit${pName}(req.params.id, req.body);
                res.send(createResponse(result, "${pName} updated successfully"))
            });

            export const delete${pName} = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${pName}Service.delete${pName}(req.params.id);
                res.send(createResponse(result, "${pName} deleted successfully"))
            });


            export const get${pName}ById = asyncHandler(async (req: Request, res: Response) => {
                const result = await ${pName}Service.get${pName}ById(req.params.id);
                if (!result) {
                    throw new NotFoundError("${pName} not found");
                }
                res.send(createResponse(result))
            });


            export const getAll${pName} = asyncHandler(async (req: Request, res: Response) => {
                const page = req.query.page ? parseInt(req.query.page as string) : 1;
                const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
                const skip = (page - 1) * limit;
                const [result, total] = await Promise.all([
                    ${pName}Service.getAll${pName}({ skip, limit }),
                    ${pName}Service.count${pName}(),
                ]);
                res.send(createPaginatedResponse(result, total, page, limit))
            });
`
}

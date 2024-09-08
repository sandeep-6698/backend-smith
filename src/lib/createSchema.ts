import { createFileHepler } from "../helper/createFileHelper";
import { schemaTemplate } from "../templates/schemaTemplate";

export const createSchema = (module: string, fields: string[]) => {
    const template = schemaTemplate(module, fields)
    createFileHepler(module, 'schema', template)
}
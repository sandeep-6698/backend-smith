import { createFileHepler } from "../helper/createFileHelper";
import { dtoTemplate } from "../templates/dtoTemplate";

export const createDto = (module: string, fields: string[]) => {
       const template = dtoTemplate(module, fields);
       createFileHepler(module, 'dto', template)
}
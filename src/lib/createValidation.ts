import { createFileHepler } from "../helper/createFileHelper";
import { validationTemplate } from "../templates/validationTemplate";

export const createValidation = (module: string, fields: string[]) => {
       const template = validationTemplate(module, fields)
       createFileHepler(module, 'validation', template)
}
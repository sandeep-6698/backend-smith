import { createFileHepler } from "../helper/createFileHelper";
import { serviceTemplate } from "../templates/serviceTemplate";

export const createService = (module: string) => {
       const template = serviceTemplate(module);
       createFileHepler(module, 'service', template)
}
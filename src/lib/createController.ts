import { createFileHepler } from "../helper/createFileHelper";
import { controllerTemplate } from "../templates/controllerTemplate";

export const createController = (module: string) => {
    const template = controllerTemplate(module);
    createFileHepler(module, 'controller', template)
}
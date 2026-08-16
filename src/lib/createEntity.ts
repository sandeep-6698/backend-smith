import { createFileHepler } from "../helper/createFileHelper";
import { entityTemplate } from "../templates/entityTemplate";

export const createEntity = (module: string, fields: string[]) => {
  const template = entityTemplate(module, fields);
  createFileHepler(module, "entity", template);
};

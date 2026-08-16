import { createFileHepler } from "../helper/createFileHelper";
import { routeTemplate } from "../templates/routeTemplate";

export const createRoute = (module: string, fields: string[] = []) => {
       const template = routeTemplate(module, fields);
       createFileHepler(module, 'route', template)
}
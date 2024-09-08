import { createFileHepler } from "../helper/createFileHelper";
import { routeTemplate } from "../templates/routeTemplate";

export const createRoute = (module: string) => {
       const template = routeTemplate(module);
       createFileHepler(module, 'route', template)
}
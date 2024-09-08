import { createSchema } from "./createSchema";
import { createValidation } from "./createValidation";
import { createDto } from "./createDto";
import { createService } from "./createService";
import { createController } from "./createController";
import { createRoute } from "./createRoute";

export function createModule(module: string, fields: string[]) {
  createDto(module, fields)
  createSchema(module, fields);
  createValidation(module, fields);
  createService(module);
  createController(module);
  createRoute(module);


}

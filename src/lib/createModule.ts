import { formatModule } from "../helper/formatModule";
import { createController } from "./createController";
import { createDto } from "./createDto";
import { createRoute } from "./createRoute";
import { createSchema } from "./createSchema";
import { createService } from "./createService";
import { createValidation } from "./createValidation";

export async function createModule(module: string, fields: string[]) {
  createDto(module, fields)
  await createSchema(module, fields);
  createValidation(module, fields);
  createService(module, fields);
  createController(module);
  createRoute(module, fields);
  await formatModule(module);
}

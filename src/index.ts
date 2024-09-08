#! /usr/bin/env node

import logger from "./lib/logger";
import { argv } from 'node:process';
import { formatFieldArgsHepler } from "./helper/formatFieldArgsHepler";
import { createModule } from "./lib/createModule";
import { createSchema } from "./lib/createSchema";
import { createRoute } from "./lib/createRoute";
import { createService } from "./lib/createService";
import { createController } from "./lib/createController";
import { createValidation } from "./lib/createValidation";
import { createDto } from "./lib/createDto";
import { createFolderHeplder } from "./helper/createFolderHelper";
import { createBase } from "./lib/createBase";


function init() {
  const [_0, _1, operation, name = '', ...rest] = argv;
  const fields = formatFieldArgsHepler(rest);

  if (!operation) {
    logger.error("Operation is required!");
    return;
  }


  if (!name) {
    logger.error("Name is required!");
    return;
  }

  switch (operation) {
    case 'create':
      createBase(name)
      break;
    case 'create:module':
      createFolderHeplder(name);
      createModule(name, fields);
      break;
    case 'create:schema':
      createFolderHeplder(name);
      createSchema(name, fields);
      break;
    case 'create:route':
      createFolderHeplder(name);
      createRoute(name);
      break;
    case 'create:service':
      createFolderHeplder(name);
      createService(name);
      break;
    case 'create:controller':
      createFolderHeplder(name);
      createController(name);
      break;
    case 'create:validation':
      createFolderHeplder(name);
      createValidation(name, fields);
      break;
    case 'create:dto':
      createFolderHeplder(name);
      createDto(name, fields);
      break;
    default:
      logger.warn(`Invalid ${operation} operation`)
  }
}

init();
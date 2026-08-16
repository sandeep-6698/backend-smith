#! /usr/bin/env node

import { createFolderHeplder } from "./helper/createFolderHelper";
import { formatFieldArgsHepler } from "./helper/formatFieldArgsHepler";
import { formatModule } from "./helper/formatModule";
import { createBase } from "./lib/createBase";
import { createController } from "./lib/createController";
import { createDto } from "./lib/createDto";
import { createModule } from "./lib/createModule";
import { createRoute } from "./lib/createRoute";
import { createSchema } from "./lib/createSchema";
import { createService } from "./lib/createService";
import { createValidation } from "./lib/createValidation";
import { setupAlias } from "./lib/setupAlias";

const { Command } = require("commander");
const { version } = require("../package.json");
const program = new Command();

program
  .name("backend-smith")
  .description("CLI tool to generate CRUD components")
  .version(version);

// Base create
program
  .command("create <name>")
  .description("Create a base component")
  .action((name: string) => {
    createBase(name);
  });

// Module
program
  .command("create:module <name> [fields...]")
  .description("Create a module with fields")
  .action(async (name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    await createModule(name, fields);
  });

// Schema
program
  .command("create:schema <name> [fields...]")
  .description("Create schema/entity/model file with fields, matching the project's configured ORM")
  .action(async (name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    await createSchema(name, fields);
    await formatModule(name);
  });

// Route
program
  .command("create:route <name> [fields...]")
  .description("Create a route file with Swagger docs generated from fields")
  .action(async (name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    createRoute(name, fields);
    await formatModule(name);
  });

// Service
program
  .command("create:service <name> [fields...]")
  .description("Create a service file (fields are used for Prisma's JSON field handling)")
  .action(async (name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    createService(name, fields);
    await formatModule(name);
  });

// Controller
program
  .command("create:controller <name>")
  .description("Create a controller file")
  .action(async (name: string) => {
    createFolderHeplder(name);
    createController(name);
    await formatModule(name);
  });

// Validation
program
  .command("create:validation <name> [fields...]")
  .description("Create a validation schema")
  .action(async (name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    createValidation(name, fields);
    await formatModule(name);
  });

// DTO
program
  .command("create:dto <name> [fields...]")
  .description("Create a DTO file")
  .action(async (name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    createDto(name, fields);
    await formatModule(name);
  });

// Alias setup (retrofit for existing projects)
program
  .command("setup:alias")
  .description(
    "Register @module path aliases for every existing module under app/ in the current project (does not touch existing imports)"
  )
  .action(async () => {
    await setupAlias();
  });

program.addHelpText(
  "afterAll",
  `
    Examples:
      # Base structure
      $ bs create my-app
          → Creates a base project structure

      # Full module with required fields, enums, and types
      $ bs create:module user *username:String age:Number *email:String *role:USER|ADMIN
          → Generates full user module with schema, controller, service, etc.

      # Schema only with required fields and enums
      $ bs create:schema user *username:String *email:String age:Number *role:USER|ADMIN

      # Nested object inside schema
      $ bs create:schema user profile:{bio:String website:String}

      # Array of primitives
      $ bs create:schema user tags:[String]

      # Array of nested objects
      $ bs create:schema user addresses:[{street:String city:String zip:String}]

      # Reference to another module (foreign key)
      $ bs create:module product *name:String *category:ref(Category)
          → Generates a categoryId field/column and, for TypeORM, a @ManyToOne relation

      # Create a route
      $ bs create:route user

      # Create a service
      $ bs create:service user

      # Create a controller
      $ bs create:controller user

      # Create validation logic
      $ bs create:validation user *username:String *email:String role:USER|ADMIN

      # Create a DTO
      $ bs create:dto user *username:String age:Number profile:{bio:String website:String}

      # Register @module path aliases for an existing project (e.g. after upgrading backend-smith)
      $ bs setup:alias
          → Adds @<module>/* → app/<module>/* to tsconfig.json for every folder under app/.
            Wires up tsconfig-paths/tsc-alias in package.json if missing. Leaves existing imports as-is.

    Aliases:
      Every module folder gets a matching TypeScript path alias automatically,
      e.g. app/common → @common, app/user → @user, app/product → @product.
      New modules created via create:module/create:schema/etc. are registered
      the moment their folder is created. Use "@user/user.dto" instead of a
      relative "../../user/user.dto" import if you prefer.

    Field Notation:
      *            → Marks a field as required
      Type         → Types can be String, Number, Boolean, Date, etc.
      Enum         → Use pipe (|) to separate values: role:USER|ADMIN
      Nested Obj   → Wrap with {}: profile:{bio:String website:String}
      Array        → Wrap with []: tags:[String]
      Array + Nest → Wrap with [{}]: addresses:[{street:String city:String}]
      Reference    → category:ref(Category) → generates a categoryId foreign key field.
                     The referenced module name is matched by kebab-case (Category → app/category).

    ⚠️  Note:
      When using special characters like [] or {} in the terminal,
      make sure to escape them or wrap the entire field in quotes.
      Example:
        $ bs create:schema user "tags:[String]" "profile:{bio:String website:String}"
    `
);

program.parse(process.argv);

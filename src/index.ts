#! /usr/bin/env node

import { createFolderHeplder } from "./helper/createFolderHelper";
import { formatFieldArgsHepler } from "./helper/formatFieldArgsHepler";
import { createBase } from "./lib/createBase";
import { createController } from "./lib/createController";
import { createDto } from "./lib/createDto";
import { createModule } from "./lib/createModule";
import { createRoute } from "./lib/createRoute";
import { createSchema } from "./lib/createSchema";
import { createService } from "./lib/createService";
import { createValidation } from "./lib/createValidation";

const { Command } = require("commander");
const program = new Command();

program
  .name("backend-smith")
  .description("CLI tool to generate CRUD components")
  .version("1.0.5");

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
  .action((name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    createModule(name, fields);
  });

// Schema
program
  .command("create:schema <name> [fields...]")
  .description("Create schema file with fields")
  .action((name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    createSchema(name, fields);
  });

// Route
program
  .command("create:route <name>")
  .description("Create a route file")
  .action((name: string) => {
    createFolderHeplder(name);
    createRoute(name);
  });

// Service
program
  .command("create:service <name>")
  .description("Create a service file")
  .action((name: string) => {
    createFolderHeplder(name);
    createService(name);
  });

// Controller
program
  .command("create:controller <name>")
  .description("Create a controller file")
  .action((name: string) => {
    createFolderHeplder(name);
    createController(name);
  });

// Validation
program
  .command("create:validation <name> [fields...]")
  .description("Create a validation schema")
  .action((name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    createValidation(name, fields);
  });

// DTO
program
  .command("create:dto <name> [fields...]")
  .description("Create a DTO file")
  .action((name: string, fieldsArgs: string[]) => {
    const fields = formatFieldArgsHepler(fieldsArgs);
    createFolderHeplder(name);
    createDto(name, fields);
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

    Field Notation:
      *            → Marks a field as required
      Type         → Types can be String, Number, Boolean, Date, etc.
      Enum         → Use pipe (|) to separate values: role:USER|ADMIN
      Nested Obj   → Wrap with {}: profile:{bio:String website:String}
      Array        → Wrap with []: tags:[String]
      Array + Nest → Wrap with [{}]: addresses:[{street:String city:String}]
    
    ⚠️  Note:
      When using special characters like [] or {} in the terminal,
      make sure to escape them or wrap the entire field in quotes.
      Example:
        $ bs create:schema user "tags:[String]" "profile:{bio:String website:String}"
    `
);

program.parse(process.argv);

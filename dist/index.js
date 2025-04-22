#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createFolderHelper_1 = require("./helper/createFolderHelper");
var formatFieldArgsHepler_1 = require("./helper/formatFieldArgsHepler");
var createBase_1 = require("./lib/createBase");
var createController_1 = require("./lib/createController");
var createDto_1 = require("./lib/createDto");
var createModule_1 = require("./lib/createModule");
var createRoute_1 = require("./lib/createRoute");
var createSchema_1 = require("./lib/createSchema");
var createService_1 = require("./lib/createService");
var createValidation_1 = require("./lib/createValidation");
var Command = require("commander").Command;
var program = new Command();
program
    .name("backend-smith")
    .description("CLI tool to generate CRUD components")
    .version("1.0.5");
// Base create
program
    .command("create <name>")
    .description("Create a base component")
    .action(function (name) {
    (0, createBase_1.createBase)(name);
});
// Module
program
    .command("create:module <name> [fields...]")
    .description("Create a module with fields")
    .action(function (name, fieldsArgs) {
    var fields = (0, formatFieldArgsHepler_1.formatFieldArgsHepler)(fieldsArgs);
    (0, createFolderHelper_1.createFolderHeplder)(name);
    (0, createModule_1.createModule)(name, fields);
});
// Schema
program
    .command("create:schema <name> [fields...]")
    .description("Create schema file with fields")
    .action(function (name, fieldsArgs) {
    var fields = (0, formatFieldArgsHepler_1.formatFieldArgsHepler)(fieldsArgs);
    (0, createFolderHelper_1.createFolderHeplder)(name);
    (0, createSchema_1.createSchema)(name, fields);
});
// Route
program
    .command("create:route <name>")
    .description("Create a route file")
    .action(function (name) {
    (0, createFolderHelper_1.createFolderHeplder)(name);
    (0, createRoute_1.createRoute)(name);
});
// Service
program
    .command("create:service <name>")
    .description("Create a service file")
    .action(function (name) {
    (0, createFolderHelper_1.createFolderHeplder)(name);
    (0, createService_1.createService)(name);
});
// Controller
program
    .command("create:controller <name>")
    .description("Create a controller file")
    .action(function (name) {
    (0, createFolderHelper_1.createFolderHeplder)(name);
    (0, createController_1.createController)(name);
});
// Validation
program
    .command("create:validation <name> [fields...]")
    .description("Create a validation schema")
    .action(function (name, fieldsArgs) {
    var fields = (0, formatFieldArgsHepler_1.formatFieldArgsHepler)(fieldsArgs);
    (0, createFolderHelper_1.createFolderHeplder)(name);
    (0, createValidation_1.createValidation)(name, fields);
});
// DTO
program
    .command("create:dto <name> [fields...]")
    .description("Create a DTO file")
    .action(function (name, fieldsArgs) {
    var fields = (0, formatFieldArgsHepler_1.formatFieldArgsHepler)(fieldsArgs);
    (0, createFolderHelper_1.createFolderHeplder)(name);
    (0, createDto_1.createDto)(name, fields);
});
program.addHelpText("afterAll", "\n    Examples:\n      # Base structure\n      $ bs create my-app\n          \u2192 Creates a base project structure\n\n      # Full module with required fields, enums, and types\n      $ bs create:module user *username:String age:Number *email:String *role:USER|ADMIN\n          \u2192 Generates full user module with schema, controller, service, etc.\n\n      # Schema only with required fields and enums\n      $ bs create:schema user *username:String *email:String age:Number *role:USER|ADMIN\n\n      # Nested object inside schema\n      $ bs create:schema user profile:{bio:String website:String}\n\n      # Array of primitives\n      $ bs create:schema user tags:[String]\n\n      # Array of nested objects\n      $ bs create:schema user addresses:[{street:String city:String zip:String}]\n\n      # Create a route\n      $ bs create:route user\n\n      # Create a service\n      $ bs create:service user\n\n      # Create a controller\n      $ bs create:controller user\n\n      # Create validation logic\n      $ bs create:validation user *username:String *email:String role:USER|ADMIN\n\n      # Create a DTO\n      $ bs create:dto user *username:String age:Number profile:{bio:String website:String}\n\n    Field Notation:\n      *            \u2192 Marks a field as required\n      Type         \u2192 Types can be String, Number, Boolean, Date, etc.\n      Enum         \u2192 Use pipe (|) to separate values: role:USER|ADMIN\n      Nested Obj   \u2192 Wrap with {}: profile:{bio:String website:String}\n      Array        \u2192 Wrap with []: tags:[String]\n      Array + Nest \u2192 Wrap with [{}]: addresses:[{street:String city:String}]\n    \n    \u26A0\uFE0F  Note:\n      When using special characters like [] or {} in the terminal,\n      make sure to escape them or wrap the entire field in quotes.\n      Example:\n        $ bs create:schema user \"tags:[String]\" \"profile:{bio:String website:String}\"\n    ");
program.parse(process.argv);


# Backend Smith (CLI Tool)

**Backend Smith** is a custom CLI tool, invoked using the command `bs`, designed to help automate the creation of various components such as modules, schemas, routes, services, controllers, validations, and DTOs for an Express.js backend. It simplifies backend structure generation.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
    -   [Available Commands](#available-commands)
    -   [Command Options](#command-options)
-   [Examples](#examples)
-   [Error Handling](#error-handling)

## Installation

To use Backend Smith, install it globally or locally.

### Global Installation

`npm install -g backend-smith` 

### Local Installation

To use it locally in your project:

`npm install backend-smith --save-dev` 

Then, you can run it with `npx`:

`npx bs <operation> <name> [fields...]` 

## Usage

Run the CLI using the following syntax:

`bs <operation> <name> [fields...]` 

### Available Commands

Backend Smith supports the following operations:

| Operation             | Description                                 |
|-----------------------|---------------------------------------------|
| `create`              | Creates a base structure for the given name |
| `create:module`       | Creates a module with the specified fields  |
| `create:schema`       | Creates a schema with the specified fields  |
| `create:route`        | Creates a route                             |
| `create:service`      | Creates a service                           |
| `create:controller`   | Creates a controller                        |
| `create:validation`   | Creates validation logic for the fields     |
| `create:dto`          | Creates a Data Transfer Object (DTO)        |


### Command Options

-   **`<operation>`**: Specifies the type of component to create (e.g., `create:module`, `create:route`, etc.).
-   **`<name>`**: The name of the component to be created.
-   **`[fields...]`**: An optional list of fields to be used in schemas, DTOs, or validations. Fields should be provided in the format `fieldName:fieldType` (e.g., `username:String`, `age:Number`).

You can also pass fields as an array or object:

-   **Array**: Pass multiple fields as separate arguments (e.g., `username:String age:Number email:String`).
-   **Object**: Pass fields in the format `{ fieldName: fieldType }` (e.g., `{ username: String, age: Number, email: String }`).

To mark a field as required, prepend the field name with an asterisk (e.g., `*username:String`).

### Examples

1.  **Create a base structure**:
    
    `bs create app-name` 
    
2.  **Create a module with fields**:
    
    `bs create:module user *username:String age:Number *email:String` 
    
3.  **Create a schema**:
    
    `bs create:schema user *username:String age:Number *email:String` 
    
4.  **Create a route**:
    
    `bs create:route user` 
    
5.  **Create a service**:
    
    `bs create:service user` 
    
6.  **Create a controller**:
    
    `bs create:controller user` 
    
7.  **Create validation for fields**:
    
    `bs create:validation user *username:String age:Number *email:String` 
    
8.  **Create a Data Transfer Object (DTO)**:
    
    `bs create:dto user *username:String age:Number *email:String` 
    

## Error Handling

-   If no operation is provided, the CLI will log:
    
    `Operation is required!` 
    
-   If no name is provided for the component, the CLI will log:
    
    `Name is required!` 
    
-   If an invalid operation is provided, the CLI will log:
    
    `Invalid <operation> operation` 
    

## Contributing

Contributions are welcome! To contribute to Backend Smith, feel free to fork the repository and submit a pull request.

Repository: [Backend Smith GitHub](https://github.com/sandeep-6698/backend-smith)
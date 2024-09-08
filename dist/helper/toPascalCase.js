"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = void 0;
var toPascalCase = function (module) {
    return module
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
        .replace(/[\s_]+/g, ' ') // Replace spaces and underscores with a single space
        .split(' ') // Split the string into words
        .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); }) // Capitalize first letter of each word
        .join('');
};
exports.toPascalCase = toPascalCase;

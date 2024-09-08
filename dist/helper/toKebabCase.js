"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebabCase = void 0;
var toKebabCase = function (module) {
    return module
        .replace(/([a-z])([A-Z])/g, '$1-$2') // Add hyphen between camelCase words
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .toLowerCase();
};
exports.toKebabCase = toKebabCase;

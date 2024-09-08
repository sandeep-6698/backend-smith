export const toKebabCase = (module: string )=>{
    return module
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Add hyphen between camelCase words
    .replace(/[\s_]+/g, '-')             // Replace spaces and underscores with hyphens
    .toLowerCase();  
}